import React from 'react'
import Phaser from 'phaser'
import MainScene from '../game/MainScene'

type AppProps = {}
type AppState = {}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)
    const game = new Phaser.Game({
      parent: 'game-root',
      type: Phaser.AUTO,
      scene: [MainScene],
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
      }
    })
  }

  render() {
    return <>
      <div id="game-root"></div>
    </>
  }
}

export default App
