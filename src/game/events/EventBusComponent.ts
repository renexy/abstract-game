
export const CUSTOM_EVENTS = Object.freeze({
    ENEMY_INIT: 'ENEMY_INIT',
    ENEMY_DESTROYED: 'ENEMY_DESTROYED',
    PLAYER_SPAWN: 'PLAYER_SPAW',
    PLAYER_DESTROYED: 'PLAYER_DESTROYED',
    GAME_OVER: 'GAME_OVER'
});

export class EventBusComponent extends Phaser.Events.EventEmitter {
    constructor() {
        super();
    }
}