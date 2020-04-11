import Phaser from 'phaser';
import { Level } from './Level';
import { Language } from './GameText'

class LanguageSelectionScene extends Phaser.Scene {
    key: string
    constructor() {
        super({ key: "languageSelectionScene" })
        this.key = "languageSelectionScene"
    }

    preload() {
        this.load.svg('GB', 'assets/GB.svg', { width: 150, height: 100 })
        this.load.svg('GR', 'assets/GR.svg', { width: 150, height: 100 })
    }

    create() {
        const gb = this.add.image(80 + 75, 240,'GB');
        const gr = this.add.image(80 + 150 + 20 + 75, 240, 'GR');

        gb.setData("language", Language.ENGLISH)
        gr.setData("language", Language.GREEK)

        gb.setInteractive()
        gr.setInteractive()

        this.input.on('gameobjectdown', this.onGameObjectDown, this);
    }

    onGameObjectDown(pointer: any, gameObject: any) {
        this.events.emit("languageSelected", gameObject.getData("language"))
    }
}

export default LanguageSelectionScene