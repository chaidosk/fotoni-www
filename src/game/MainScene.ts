import Phaser from 'phaser';
import { Level } from './Level';
import LevelScene from './LevelScene';
import { GameText, Language } from './GameText'
import LanguageSelectionScene from './LanguageSelectionScene';

class MainScene extends Phaser.Scene {
  levels: Level[]
  languageSelectionScene: LanguageSelectionScene
  currentLevelScene: LevelScene
  currentLevelIndex: integer
  onCompleteRegistered: boolean
  onLanguageSelectedRegistered: boolean
  gameText: GameText
  languageSelected: boolean
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
    this.languageSelected = false
    this.onCompleteRegistered = false
    this.onLanguageSelectedRegistered = false
    this.gameText = new GameText(Language.GREEK)
  }

  create() {
    this.languageSelectionScene = new LanguageSelectionScene()
    this.scene.add(this.languageSelectionScene.key, this.languageSelectionScene, true)
    this.onLanguageSelectedRegistered = false
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

  onLanguageSelected(language: Language) {
    this.gameText = new GameText(language)
    this.scene.stop(this.languageSelectionScene.key)
    this.scene.remove(this.languageSelectionScene.key)
    this.languageSelectionScene.events.removeAllListeners("languageSelected")


    this.currentLevelScene = new LevelScene(this.levels[0], this.gameText);
    this.scene.add(this.currentLevelScene.key, this.currentLevelScene, true);
    this.onCompleteRegistered = false;
  }

  update() {
    if (!this.onLanguageSelectedRegistered && this.languageSelectionScene && this.languageSelectionScene.events) {
      this.languageSelectionScene.events.on("languageSelected", this.onLanguageSelected, this)
      this.onLanguageSelectedRegistered = true
    }
    if (!this.onCompleteRegistered && this.currentLevelScene && this.currentLevelScene.events) {
      this.currentLevelScene.events.on("completed", this.onLevelCompleted, this)
      this.onCompleteRegistered = true
    }

  }
}

export default MainScene

