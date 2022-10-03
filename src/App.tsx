import { Component } from 'react'
import { connect } from 'react-redux'

import './App.css'
import GameGrid from './components/GameGrid'
import GameSettings from './components/GameSettings'
import Ball from './components/Ball'
import HistoryButtons from './components/HistoryButtons'
import { resetGame } from './actions/game'

import type { AppProps, AppState } from './interfaces'

class App extends Component<AppProps> {
  settings: any = {} // FIXME
  state: AppState
  constructor(props) {
    super(props)
    this.state = { showSettings: false }
  }

  toggleSettings = () => {
    const value = !this.state.showSettings
    this.setState({ showSettings: value }, () => {
      if (value)
        this.settings.scrollIntoView()
    })
  }

  render() {
    const currentPlayerName = this.props.players[this.props.currentPlayer].nick
    // console.log(this.props)
    return (
      <div className="app">
        <header className="header">
          <div className="logo">
            <Ball color="#0099ff" clicksToBlow={3} className="large-ball" />
          </div>
          <h1 className="title">Chain Reaction</h1>
          <div className="logo">
            <Ball color="#0099ff" clicksToBlow={3} className="large-ball" />
          </div>
        </header>
        <div ref={x => this.settings = x} className="app-settings">
          <div className="settings-wrapper">
            <h2 className="no-margin">Settings</h2>
            <GameSettings show={this.state.showSettings} />
          </div>
          <div onClick={this.toggleSettings} className="settings-toggle" />
        </div>
        <p className="intro">
          {this.props.gameEnded
            ? <span className="victory">{`${currentPlayerName} won!`}</span>
            : <span>{`${currentPlayerName} turn.`}</span>
          }
        </p>
        <HistoryButtons />
        <GameGrid />
        <div className="footer">
          <button onClick={this.props.reset}>
            Reset game
          </button>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    reset: () => {
      dispatch(resetGame())
    },
  }
}

const mapStateToProps = (state) => {
  // console.log(state.game.present)
  return {
    currentPlayer: state.game.present.currentPlayer,
    gameEnded: state.game.present.gameEnded,
    playerName: state.game.present.playerName,
    playerAddr: state.game.present.playerAddr,
    players: state.game.present.players,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
