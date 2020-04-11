import Phaser from 'phaser'
import MainScene from './game/MainScene'

const game = new Phaser.Game({
    type: Phaser.AUTO,
    scene: [MainScene],
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
  })