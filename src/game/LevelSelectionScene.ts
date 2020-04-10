import Phaser from 'phaser';
import { GameText, TextTerm } from './GameText';
import { Level } from './Level';

class LevelSelectionScene extends Phaser.Scene {
    levels: Level[]
    key: string
    pages: Level[][]
    currentOptions: Phaser.GameObjects.Text[]
    currentPage: integer
    levelsPerScreen: integer
    levelsPerRow: integer
    updateOptions: boolean
    constructor(levels: Level[]) {
        super({ key: "LevelSelectionScene" })
        this.key = "LevelSelectionScene"
        this.levels = levels
        this.levelsPerScreen = 6
        this.levelsPerRow = 3
        this.pages = this.toChunks(this.levels, this.levelsPerScreen)
        this.currentPage = 0
        this.currentOptions = []
        this.updateOptions = true
    }

    toChunks<T>(array: T[], perChunck: integer): T[][] {
        const result: T[][] = []
        let line: T[] = []
        array.forEach(element => {
            if (line.length < perChunck) {
                line.push(element)
            } else {
                result.push(line);
                line = []
                line.push(element)
            }
        });
        if (line.length > 0) {
            result.push(line)
        }
        return result
    }

    preload() {
        // TODO: load from json
    }

    create() {
        const xPrevious = 128 + (this.levelsPerScreen % this.levelsPerRow) * 2 * 64 + 64
        const yPrevious = 128 + Math.floor(this.levelsPerScreen / this.levelsPerRow) * 2 * 64 + 32
        const previous = this.add.text(xPrevious, yPrevious,
                                       "<",
                                       { fontFamily: '"Roboto Condensed"', fontSize: "64px" })
        previous.setData("item", "previous")
        previous.setInteractive()
        const xNext = xPrevious + 128
        const yNext = yPrevious
        const next = this.add.text(xNext, yNext,
                                   ">",
                                   { fontFamily: '"Roboto Condensed"', fontSize: "64px" })
        next.setData("item", "next")
        next.setInteractive()
        this.input.on('gameobjectdown', this.onGameObjectDown, this);
    }

    renderOptions() {
        this.currentOptions.forEach(element => {
            element.setVisible(false)
            element.setActive(false)
            element.setInteractive(false)
        });
        this.currentOptions = []
        this.pages[this.currentPage].forEach((level: Level, index: integer) => {
            const xRel = (index % this.levelsPerRow) * 2 * 64
            const yRel = Math.floor(index / this.levelsPerRow) * 2 * 64
            const levelText = this.add.text(128 + xRel, 128 + yRel,
                                            " " + level.name,
                                            { fontFamily: '"Roboto Condensed"', fontSize: "64px" })
            levelText.setInteractive()
            levelText.setData("item", "level")
            levelText.setData("level", level)
            this.currentOptions.push(levelText)
        })
    }

    onGameObjectDown(pointer: any, gameObject: any) {
        if (gameObject.getData("item") === "level") {
            this.events.emit("levelSelected", gameObject.getData("level"))
        }
        if (gameObject.getData("item") === "next") {
            this.currentPage += 1
            this.currentPage = this.currentPage % this.pages.length
            this.updateOptions = true
        }
        if (gameObject.getData("item") === "previous") {
            this.currentPage -= 1
            if (this.currentPage < 0) {
                this.currentPage = this.pages.length - 1
            }
            this.updateOptions = true
        }
    }

    update() {
        if (this.updateOptions) {
            this.renderOptions()
            this.updateOptions = false
        }
    }
}

export default LevelSelectionScene