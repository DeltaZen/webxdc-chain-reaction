import { Component } from 'react'
import { connect } from 'react-redux'

import type { ReceivedStatusUpdate } from 'webxdc'
import type { AppProps, AppState, CRUpdate, UpdateState } from './interfaces'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CLICK_CELL, INIT_GAME, MODIFY_PLAYER, UPDATE_ADMIN_STATE, resetGame, updateAdminState, updateState } from './actions/game'

import './App.css'
import GameGrid from './components/GameGrid'
import GameSettings from './components/GameSettings'
import Ball from './components/Ball'
// import HistoryButtons from './components/HistoryButtons'

import PlayerList from './components/PlayerList'

const playerAddr = window.webxdc.selfAddr

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

  componentDidMount(): void {
    window.webxdc.setUpdateListener((update: ReceivedStatusUpdate<CRUpdate>) => {
      if (update.serial && update.max_serial && update.serial === update.max_serial) {
        try {
          const { type, state } = update.payload
          // do stuff
          const currentActivePlayers = this.props.players.filter(player => player.address)
          const updatedActivePlayers = state.players.filter(player => player.address)

          const itsMyGame = updatedActivePlayers[0].address === currentActivePlayers[0]?.address
            && playerAddr === updatedActivePlayers[0].address

          if (
            type === INIT_GAME
            && itsMyGame
          ) {
            this.props.adminUpdate({
              ...state,
              gameStarted: true,
            })
            return
          }
          else if (itsMyGame && type !== UPDATE_ADMIN_STATE) {
            if (
              updatedActivePlayers.length <= currentActivePlayers.length
              || !state.gameStarted
            )
              return

            this.props.adminUpdate(state)
          }
          else {
            // eslint-disable-next-line no-console
            console.log('Applying\n', state)
            this.props.update(state)
          }
        }
        catch (error) {
          // eslint-disable-next-line no-console
          console.log(error)
        }
      }
    })
  }

  render() {
    const currentActivePlayers = this.props.players.filter(player => player.address)
    const currentPlayerName = this.props.players[this.props.currentPlayer].nick
    const iAmIn = this.props.players.some(player => player.address === playerAddr)
    // console.log(this.props.players)
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
        {!this.props.gameStarted
          ? <div ref={x => this.settings = x} className="app-settings">
            <div className="settings-wrapper">
              <h2 className="no-margin">Settings</h2>
              <GameSettings show={true} />
            </div>
            <div onClick={this.toggleSettings} className="settings-toggle" />
          </div>
          : <>
            {currentActivePlayers.length === this.props.players.length
              ? <p className="intro">
                {this.props.gameEnded
                  ? <span className="victory">{`${currentPlayerName} won!`}</span>
                  : <span>{`${currentPlayerName} turn.`}</span>
                }
              </p>
              : <p className="intro">
                <span>{currentActivePlayers.length} of {this.props.players.length} players are ready</span><br />
                <PlayerList players={this.props.players} />
                {iAmIn
                  && <span>Waiting for the other players to start</span>
                }
              </p>}
            <p className="button-toolbar">
              <button onClick={this.props.reset} disabled={currentActivePlayers.length === this.props.players.length || iAmIn}>
                Join
              </button>
              <button onClick={this.props.reset} disabled={currentActivePlayers.length !== this.props.players.length}>
                Start
              </button>
            </p>
            <GameGrid />
            <div className="footer">
              <button onClick={this.props.reset}>
                Reset game
              </button>
            </div>
          </>
        }

      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    reset: () => {
      dispatch(resetGame())
    },
    update: (state: UpdateState) => {
      dispatch(updateState(state))
    },
    adminUpdate: (state: UpdateState) => {
      dispatch(updateAdminState(state))
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
    gameStarted: state.game.present.gameStarted,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
