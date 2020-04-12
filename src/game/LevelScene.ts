import Phaser, { GameObjects } from 'phaser';
import { GameText, TextTerm, Language } from './GameText';
import { Level } from './Level';
import { LevelEvent, LevelEventType } from './LevelEvent';

class LevelScene extends Phaser.Scene {
  tiles: Phaser.GameObjects.Group
  tilesMap: Map<string, any>
  level: Level
  key: string
  gameText: GameText
  currentMap: integer[][]
  levelEvents: LevelEvent[]
  blackFrame: integer
  whiteFrame: integer
  crossFrame: integer
  menuFrame: integer
  undoFrame: integer
  hintFrame: integer
  clearAllFrame: integer
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
    this.levelEvents = []
    this.tilesMap = new Map()
  }

  preload() {
    this.whiteFrame = 0
    this.blackFrame = 1
    this.menuFrame = 2
    this.crossFrame = 4
    this.undoFrame = 5
    this.clearAllFrame = 7
    if (this.gameText.language === Language.GREEK) {
      this.hintFrame = 6
    } else {
      this.hintFrame = 3
    }
    this.cellHeight = 32
    this.cellWidth = 32
    this.load.spritesheet('tiles', 'assets/tiles.png',
                          { frameWidth: this.cellWidth, frameHeight: this.cellHeight });
    this.renderAtX = 3 * 32 + 24
    this.renderAtY = 3 * 32 + 24
    this.completed = false
  }

  create() {
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

    this.add.text(8, 8, this.gameText.text(TextTerm.Level) + " " + this.level.name,
                  { fontFamily: '"Roboto Condensed"', fontSize: "16px" })
    const levelSelection = this.add.sprite(24, 48, "tiles", this.menuFrame)
    levelSelection.setData("item", "levelSelection")
    levelSelection.setInteractive()

    const clearAll = this.add.sprite(64, 48, "tiles", this.clearAllFrame)
    clearAll.setData("item", "clearAll")
    clearAll.setInteractive()

    const undo = this.add.sprite(24, 88, "tiles", this.undoFrame)
    undo.setData("item", "undo")
    undo.setInteractive()

    const hint = this.add.sprite(64, 88, "tiles", this.hintFrame)
    hint.setData("item", "hint")
    hint.setInteractive()

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
      this.tilesMap.set(tileX + "#" + tileY, child)
      child.setData("position", tilePosition)
    }.bind(this))

    this.clearMap()

    this.input.on('gameobjectdown', this.onGameObjectDown, this);
  }

  clearMap() {
    this.currentMap = []
    this.level.map.forEach(element => {
      this.currentMap.push(Array(this.level.width).fill(0))
    });
    this.tiles.children.iterate(function (child: any) {
      child.setFrame(this.whiteFrame)
    }.bind(this))
  }

  rerender() {
    this.clearMap()
    this.levelEvents.forEach(levelEvent => {
      if (levelEvent.type === LevelEventType.CLEAR_ALL) {
        this.clearMap()
      }
      if (levelEvent.type === LevelEventType.TILE_CLICKED) {
        const tile = this.tilesMap.get(levelEvent.tileX +"#"+ levelEvent.tileY)
        this.switchTile(tile)
      }
    });
  }

  switchTile(gameObject: any) {
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

  showHint() {
    if (this.completed) {
      return
    }
    let hintFound = false
    while(!hintFound) {
      const x: integer = Phaser.Math.Between(0, this.level.width - 1);
      const y: integer = Phaser.Math.Between(0, this.level.height - 1);
      if (this.level.map[y][x] !== this.currentMap[y][x]) {
        hintFound = true
        const tile = this.tilesMap.get(x +"#"+ y)
        this.onGameObjectDown(null, tile)
      }
    }
  }

  onGameObjectDown(pointer: any, gameObject: any) {
    if (gameObject.getData("item") === "tile") {
      this.switchTile(gameObject)
      const position = gameObject.getData("position")
      this.levelEvents.push(LevelEvent.tileClicked(position.x, position.y))
    }
    if (gameObject.getData("item") === "levelSelection") {
      this.events.emit("completed")
    }
    if (gameObject.getData("item") === "clearAll") {
      this.clearMap()
      this.levelEvents.push(LevelEvent.clearAll())
    }
    if (gameObject.getData("item") === "undo") {
      this.levelEvents.pop()
      this.rerender()
    }
    if (gameObject.getData("item") === "hint") {
      this.showHint()
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

