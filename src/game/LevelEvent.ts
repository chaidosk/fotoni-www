export enum LevelEventType {
    TILE_CLICKED,
    CLEAR_ALL
}
export class LevelEvent {
    type: LevelEventType
    tileX?: integer
    tileY?: integer

    constructor(type: LevelEventType, tileX?: integer, tileY?: integer) {
        this.type = type
        this.tileX = tileX
        this.tileY = tileY
    }

    static clearAll() {
        return new LevelEvent(LevelEventType.CLEAR_ALL)
    }

    static tileClicked(tileX: integer, tileY: integer) {
        return new LevelEvent(LevelEventType.TILE_CLICKED, tileX, tileY)
    }
}

export default { LevelEventType, LevelEvent }