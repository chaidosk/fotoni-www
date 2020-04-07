import Phaser from 'phaser'

class MainScene extends Phaser.Scene {
  tiles: Phaser.GameObjects.Group
  constructor() {
    super('MainScene');
    Phaser.Scene.call(this);
  }

  preload ()
  {
    this.load.spritesheet('tiles', 'assets/gridtiles.png', { frameWidth: 32, frameHeight: 32 });
  }

  create ()
  {
    // for typescript linting
    var adder : any = this.add

    this.tiles = adder.group({
      key: 'tiles',
      frame: [ 41 ],
      frameQuantity: 12 * 12
    });

    Phaser.Actions.GridAlign(this.tiles.getChildren(), {
        width: 12,
        height: 12,
        cellWidth: 32,
        cellHeight: 32,
        x: 100,
        y: 100
    });

    this.tiles.children.iterate(function (child: any) {
      child.setInteractive();
      child.setData("item", "tile")
    });

    this.input.on('gameobjectdown', this.onGameObjectDown, this);
  }

  onGameObjectDown(pointer: any, gameObject: any) {
    if (gameObject.getData("item") == "tile") {
        if (gameObject.frame.name == 41) {
          gameObject.setFrame(14)
        } else if (gameObject.frame.name == 14) {
          gameObject.setFrame(41)
        }
    }
  }

  update ()
  {
  }
}

export default MainScene

