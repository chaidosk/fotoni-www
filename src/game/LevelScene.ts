import Phaser from 'phaser';
import { GameText, TextTerm } from './GameText';
import { Level } from './Level';

class LevelScene extends Phaser.Scene {
  tiles: Phaser.GameObjects.Group
  level: Level
  key: string
  gameText: GameText
  currentMap: integer[][]
  blackFrame: integer
  whiteFrame: integer
  crossFrame: integer
  cellWidth: integer
  cellHeight: integer
  renderAtX: integer
  renderAtY: integer
  completed: boolean
  constructor(level: Level, gameText: GameText) {
    super({ key: "level" + level.name });
    this.key = "level" + level.name
    this.level = level
    this.gameText = gameText
  }

  preload() {
    this.whiteFrame = 41
    this.blackFrame = 14
    this.crossFrame = 98
    this.cellHeight = 32
    this.cellWidth = 32
    this.load.spritesheet('tiles', 'assets/gridtiles.png',
                          { frameWidth: this.cellWidth, frameHeight: this.cellHeight });
    this.renderAtX = 3 * 32 + 24
    this.renderAtY = 3 * 32 + 24
    this.completed = false
  }

  create() {
    this.currentMap = []
    this.level.map.forEach(element => {
      this.currentMap.push(Array(this.level.width).fill(0))
    });
    // for typescript linting
    const adder: any = this.add

    this.level.aboveHelper.forEach((element, xIndex) => {
      [].concat(element).reverse().forEach((value, yIndex) => {
        this.add.text(this.renderAtX + (xIndex * this.cellWidth),
                      this.renderAtY - this.cellHeight - ((yIndex) * this.cellHeight / 2),
                      "" + value,
                      { fontFamily: '"Roboto Condensed"', fontSize: "16px" });
      });
    });
    this.level.sideHelper.forEach((element, yIndex) => {
      [].concat(element).reverse().forEach((value, xIndex) => {
        this.add.text(this.renderAtX - this.cellWidth - (xIndex * this.cellWidth / 2),
                      this.renderAtY + (yIndex * this.cellHeight),
                      "" + value,
                      { fontFamily: '"Roboto Condensed"', fontSize: "16px" });
      });
    });

    this.add.text(8, 32, this.gameText.text(TextTerm.Level) + " " + this.level.name,
                  { fontFamily: '"Roboto Condensed"', fontSize: "16px" })
    const levelSelection = this.add.text(8, 8, this.gameText.text(TextTerm.LevelSelection),
                                         { fontFamily: '"Roboto Condensed"', fontSize: "16px"})
    levelSelection.setData("item", "levelSelection")
    levelSelection.setInteractive()

    this.tiles = adder.group({
      key: 'tiles',
      frame: [this.whiteFrame],
      frameQuantity: this.level.height * this.level.width
    });

    Phaser.Actions.GridAlign(this.tiles.getChildren(), {
      width: this.level.width,
      height: this.level.height,
      cellWidth: this.cellWidth,
      cellHeight: this.cellHeight,
      x: this.renderAtX,
      y: this.renderAtY
    });

    this.tiles.children.iterate(function (child: any) {
      child.setInteractive();
      child.setData("item", "tile")
      const tileX = Math.floor((child.x - this.renderAtX) / this.cellWidth)
      const tileY = Math.floor((child.y - this.renderAtY) / this.cellHeight)
      const tilePosition = { x: tileX, y: tileY }
      child.setData("position", tilePosition)
    }.bind(this));

    this.input.on('gameobjectdown', this.onGameObjectDown, this);
  }

  onGameObjectDown(pointer: any, gameObject: any) {
    if (gameObject.getData("item") === "tile") {
      const position = gameObject.getData("position")
      if (gameObject.frame.name === this.whiteFrame) {
        gameObject.setFrame(this.blackFrame)
        this.currentMap[position.y][position.x] = 1
      } else if (gameObject.frame.name === this.blackFrame) {
        gameObject.setFrame(this.crossFrame)
        this.currentMap[position.y][position.x] = 0
      } else if (gameObject.frame.name === this.crossFrame) {
        gameObject.setFrame(this.whiteFrame)
        this.currentMap[position.y][position.x] = 0
      }
    }
    if (gameObject.getData("item") === "levelSelection") {
      this.events.emit("completed")
    }
  }

  update() {
    if (!this.completed && JSON.stringify(this.currentMap) === JSON.stringify(this.level.map)) {
      this.completed = true
      this.events.emit("completed")
    }
  }
}

export default LevelScene

