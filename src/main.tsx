import { createRoot } from "react-dom/client";
import "./global.css";
import App from "./App.tsx";
import { createTheme, ThemeProvider } from "@mui/material";
import { Toaster } from "react-hot-toast";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Primary color
    },
    secondary: {
      main: "#545D67", // Secondary color
      light: "#ff5c8d",
      dark: "#AE9B88",
    },
  },
});
createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <Toaster position="top-right" />
    <App />
  </ThemeProvider>
);
