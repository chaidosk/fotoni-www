import Phaser from 'phaser';
import {Level} from './Level';
import LevelScene from './LevelScene';
import {GameText, Language } from './GameText'

class MainScene extends Phaser.Scene {
  levels: Level[]
  currentLevelScene: LevelScene
  currentLevelIndex: integer
  onCompleteRegistered: boolean
  gameText: GameText
  constructor() {
    super('MainScene');
    Phaser.Scene.call(this);
    this.levels = [
      new Level("1", [
        [0, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [0, 1, 1, 0]
      ]),
      new Level("2", [
        [1, 1, 1, 0],
        [1, 0, 0, 1],
        [0, 1, 0, 1],
        [0, 1, 1, 0]
      ]),
      new Level("3", [
        [0, 1, 1, 0],
        [1, 0, 1, 1],
        [1, 1, 0, 1],
        [0, 1, 1, 0]
      ]),
    ];
    this.currentLevelIndex = 0
    this.gameText = new GameText(Language.GREEK)
  }

  create ()
  {
    this.currentLevelScene = new LevelScene(this.levels[0], this.gameText);
    this.scene.add(this.currentLevelScene.key, this.currentLevelScene, true);
    this.onCompleteRegistered = false;
  }

  onLevelCompleted() {
    this.scene.stop(this.currentLevelScene.key);
    this.scene.remove(this.currentLevelScene.key);
    this.currentLevelScene.events.removeAllListeners("completed")

    this.currentLevelIndex += 1
    this.currentLevelIndex = this.currentLevelIndex % this.levels.length;
    this.currentLevelScene = new LevelScene(this.levels[this.currentLevelIndex], this.gameText)
    this.scene.add(this.currentLevelScene.key, this.currentLevelScene, true);
    this.onCompleteRegistered = false
  }

  update ()
  {
    if (! this.onCompleteRegistered && this.currentLevelScene.events) {
      this.currentLevelScene.events.on("completed", this.onLevelCompleted, this)
      this.onCompleteRegistered = true;
    }
    
  }
}

export default MainScene

