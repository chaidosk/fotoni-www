import Phaser from 'phaser';
import { Level } from './Level';
import LevelScene from './LevelScene';
import { GameText, Language } from './GameText'
import LanguageSelectionScene from './LanguageSelectionScene';
import LevelSelectionScene from './LevelSelectionScene'

class MainScene extends Phaser.Scene {
  languageSelectionScene: LanguageSelectionScene
  onLanguageSelectedRegistered: boolean
  levelSelectionScene: LevelSelectionScene
  onLevelSelectedRegistered: boolean
  currentLevelScene: LevelScene
  onCompleteRegistered: boolean
  gameText: GameText
  languageSelected: boolean
  levels: Level[]
  completedLevels: string[]
  private readonly localStrorageLevelsCompletedKey = "fotoni-completedLevels-V1";

  constructor() {
    super('MainScene');
    Phaser.Scene.call(this);
    this.languageSelected = false
    this.onCompleteRegistered = false
    this.onLanguageSelectedRegistered = false
    this.onLevelSelectedRegistered = false
    this.gameText = new GameText(Language.GREEK)
    const fromLocalStorage = JSON.parse(localStorage.getItem(this.localStrorageLevelsCompletedKey))
    if (fromLocalStorage) {
      this.completedLevels = fromLocalStorage
    } else {
      this.completedLevels = []
    }
  }

  preload() {
    this.load.json('levels', 'assets/levels.json');
  }

  create() {
    this.languageSelectionScene = new LanguageSelectionScene()
    this.scene.add(this.languageSelectionScene.key, this.languageSelectionScene, true)
    this.onLanguageSelectedRegistered = false

    const levelsJson = this.cache.json.get('levels');
    this.levels = this.createLevels(levelsJson)
  }

  createLevels(levelsJson: any): Level[] {
    const levels: Level[] = []
    Object.keys(levelsJson).forEach(levelName => {
      levels.push(new Level(levelName, levelsJson[levelName]))
    });
    return levels
  }

  onLevelCompleted() {
    this.scene.stop(this.currentLevelScene.key);
    this.scene.remove(this.currentLevelScene.key);
    this.currentLevelScene.events.removeAllListeners("completed")

    if (this.currentLevelScene.completed) {
      this.completedLevels.push(this.currentLevelScene.level.name)
      localStorage.setItem(this.localStrorageLevelsCompletedKey, JSON.stringify(this.completedLevels));
    }

    this.levelSelectionScene = new LevelSelectionScene(this.levels, this.completedLevels);
    this.scene.add(this.levelSelectionScene.key, this.levelSelectionScene, true);
    this.onLevelSelectedRegistered = false;
  }

  onLanguageSelected(language: Language) {
    this.gameText = new GameText(language)
    this.scene.stop(this.languageSelectionScene.key)
    this.scene.remove(this.languageSelectionScene.key)
    this.languageSelectionScene.events.removeAllListeners("languageSelected")

    this.levelSelectionScene = new LevelSelectionScene(this.levels, this.completedLevels);
    this.scene.add(this.levelSelectionScene.key, this.levelSelectionScene, true);
    this.onLevelSelectedRegistered = false;
  }

  onLevelSelected(level: Level) {
    this.scene.stop(this.levelSelectionScene.key);
    this.scene.remove(this.levelSelectionScene.key);
    this.levelSelectionScene.events.removeAllListeners("levelSelected")

    this.currentLevelScene = new LevelScene(level, this.gameText)
    this.scene.add(this.currentLevelScene.key, this.currentLevelScene, true);
    this.onCompleteRegistered = false
  }

  update() {
    if (!this.onLanguageSelectedRegistered && this.languageSelectionScene && this.languageSelectionScene.events) {
      this.languageSelectionScene.events.on("languageSelected", this.onLanguageSelected, this)
      this.onLanguageSelectedRegistered = true
    }
    if (!this.onLevelSelectedRegistered && this.levelSelectionScene && this.levelSelectionScene.events ) {
      this.levelSelectionScene.events.on("levelSelected", this.onLevelSelected, this)
      this.onLevelSelectedRegistered = true
    }
    if (!this.onCompleteRegistered && this.currentLevelScene && this.currentLevelScene.events) {
      this.currentLevelScene.events.on("completed", this.onLevelCompleted, this)
      this.onCompleteRegistered = true
    }
  }
}

export default MainScene

