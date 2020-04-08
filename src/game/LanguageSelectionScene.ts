import Phaser from 'phaser';
import {Level} from './Level';
import {Language} from './GameText'
    
class LanguageSelectionScene extends Phaser.Scene {
    key: string
    constructor() {
        super({key:"languageSelectionScene"})
        this.key="languageSelectionScene"
    }
    
    preload()
    {
        this.load.svg('GB', 'assets/GB.svg', {width:300, height:200})
        this.load.svg('GR', 'assets/GR.svg', {width:300, height:200})
    }

    create() {
        const gb = this.add.image(200, 150, 'GB');
        const gr = this.add.image(550, 150, 'GR');
        
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