import Phaser from 'phaser'
import MainScene from './game/MainScene'

const game = new Phaser.Game({
    type: Phaser.AUTO,
    scene: [MainScene],
    width: 500,
    height: 500,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
  })