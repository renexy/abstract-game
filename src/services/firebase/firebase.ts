/* eslint-disable @typescript-eslint/no-explicit-any */
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const saveHighScore = async (
  score: number,
  walletAddress: string
) => {
  try {
    const wa = walletAddress?.toLowerCase();
    const scoresRef = collection(db, "leaderboard");
    const q = query(scoresRef, where("wa", "==", wa));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const scores = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const existingScore = scores.find(
        (s: any) => s.wa === wa
      ) as any;

      if (existingScore) {
        if (score > existingScore.score) {
          await updateDoc(doc(db, "leaderboard", existingScore.id), {
            score,
            timestamp: new Date(),
          });
          return { message: "High score updated!", code: "UPDATED" };
        } else {
          return {
            message: `Your highest score is: ${
              existingScore.highScore
            }.`,
            code: "SCORE_LOWER",
          };
        }
      }
    }

    await addDoc(scoresRef, {
      score,
      wa,
      timestamp: new Date(),
    });
    return { message: "Score updated!", code: "UPDATED" };
  } catch (error) {
    console.error("Error saving score:", error);
    throw error;
  }
};

export const getAllHighScores = async () => {
  try {
    const scoresRef = collection(db, "leaderboard");
    const querySnapshot = await getDocs(scoresRef);

    if (!querySnapshot.empty) {
      const highScores = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return highScores; // Return an array of high score objects
    }
    return []; // Return an empty array if no scores are found
  } catch (error) {
    console.error("Error retrieving high scores:", error);
    throw error;
  }
};
