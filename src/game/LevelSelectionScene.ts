import Phaser from 'phaser';
import { GameText, TextTerm } from './GameText';
import { Level } from './Level';

class LevelSelectionScene extends Phaser.Scene {
    levels: Level[]
    completedLevels: string[]
    key: string
    pages: Level[][]
    currentOptions: Phaser.GameObjects.Text[]
    currentPage: integer
    levelsPerScreen: integer
    levelsPerRow: integer
    updateOptions: boolean
    constructor(levels: Level[], completedLevels: string[]) {
        super({ key: "LevelSelectionScene" })
        this.key = "LevelSelectionScene"
        this.levels = levels
        this.levelsPerScreen = 9
        this.levelsPerRow = 3
        this.pages = this.toChunks(this.levels, this.levelsPerScreen)
        this.completedLevels = completedLevels
        this.currentPage = this.firstWithUncompleted(this.pages, this.completedLevels)
        this.currentOptions = []
        this.updateOptions = true
    }

    firstWithUncompleted(pages: Level[][], completedLevels: string[]) : integer {
        for(let i = 0; i < pages.length; i++) {
            const page = pages[i]
            if (page.filter(level => !completedLevels.includes(level.name)).length > 0) {
                return i
            }
        }
        return 0
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
        const xPreviousx5 = 32 + (this.levelsPerScreen % this.levelsPerRow) * 3 * 32
        const yPreviousx5 = 64 + Math.floor(this.levelsPerScreen / this.levelsPerRow) * 3 * 32
        const previousx5 = this.add.text(xPreviousx5, yPreviousx5,
                                         "<<",
                                         { fontFamily: '"Roboto Condensed"', fontSize: "64px" })
        previousx5.setData("item", "previousx5")
        previousx5.setInteractive()
        const xPrevious = xPreviousx5 + 128
        const yPrevious = yPreviousx5
        const previous = this.add.text(xPrevious, yPrevious,
                                       "<",
                                       { fontFamily: '"Roboto Condensed"', fontSize: "64px" })
        previous.setData("item", "previous")
        previous.setInteractive()

        const xNext = xPrevious + 96
        const yNext = yPrevious
        const next = this.add.text(xNext, yNext,
                                   ">",
                                   { fontFamily: '"Roboto Condensed"', fontSize: "64px" })
        next.setData("item", "next")
        next.setInteractive()

        const xNextx5 = xNext + 96
        const yNextx5 = yNext
        const nextx5 = this.add.text(xNextx5, yNextx5,
                                     ">>",
                                     { fontFamily: '"Roboto Condensed"', fontSize: "64px" })
        nextx5.setData("item", "nextx5")
        nextx5.setInteractive()
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
            const xRel = (index % this.levelsPerRow) * 5 * 32
            const yRel = Math.floor(index / this.levelsPerRow) * 3 * 32
            const levelText = this.add.text(16 + xRel, 32 + yRel,
                                            " " + level.name,
                                            { fontFamily: '"Roboto Condensed"', fontSize: "64px" })
            if (this.completedLevels.includes(level.name)) {
                levelText.setStyle({ fontFamily: '"Robot Condensed"', fontSize: "64px", color: "#a11"})
            }
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
        if (gameObject.getData("item") === "nextx5") {
            this.currentPage += 5
            this.currentPage = this.currentPage % this.pages.length
            this.updateOptions = true
        }
        if (gameObject.getData("item") === "previousx5") {
            this.currentPage -= 5
            if (this.currentPage < 0) {
                this.currentPage = (this.pages.length + this.currentPage) % this.pages.length
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