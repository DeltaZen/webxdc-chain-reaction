import { Component } from 'react'
import { connect } from 'react-redux'

import type { ReceivedStatusUpdate } from 'webxdc'
import type { AppProps, AppState, CRUpdate, UpdateState } from './interfaces'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { INIT_GAME, MODIFY_PLAYER, UPDATE_ADMIN_STATE, modifyPlayer, resetGame, updateAdminState, updateState } from './actions/game'

import './App.css'
import GameGrid from './components/GameGrid'
import GameSettings from './components/GameSettings'
import Ball from './components/Ball'

import PlayerList from './components/PlayerList'

const playerAddr = window.webxdc.selfAddr
const playerName = window.webxdc.selfName

class App extends Component<AppProps> {
  settings: any = {}
  state: AppState
  constructor(props) {
    super(props)
    this.state = { showSettings: true }
  }

  toggleSettings = () => {
    const value = !this.state.showSettings
    this.setState({ showSettings: value }, () => {
      if (value)
        this.settings.scrollIntoView()
    })
  }

  joinGame = () => this.props.modifyPlayer(playerName, playerAddr)

  resend = () => this.props.adminUpdate({
    grid: this.props.grid,
    currentPlayer: this.props.currentPlayer,
    players: this.props.players,
    rows: this.props.rows,
    cols: this.props.cols,
    turn: this.props.turn,
    gameStarted: this.props.gameStarted,
    gameEnded: this.props.gameEnded,
    playerName,
    playerAddr,
  })

  componentDidMount(): void {
    window.webxdc.setUpdateListener((update: ReceivedStatusUpdate<CRUpdate>) => {
      const lastSerial = parseInt(localStorage.getItem('last-serial') ?? '0')
      if (
        update.serial
        && update.max_serial
        && update.serial === update.max_serial
        && update.serial > lastSerial
      ) {
        localStorage.setItem('last-serial', `${update.serial}`)
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
              (updatedActivePlayers.length <= currentActivePlayers.length && this.props.turn === state.turn && !state.gameEnded && !state.click)
              || !state.gameStarted
            )
              return

            this.props.adminUpdate(state)
          }
          else {
            if (
              type !== MODIFY_PLAYER
              && !state.gameEnded
              && updatedActivePlayers.length > 1
              && (
                this.props.turn > state.turn
                || (
                  this.props.turn === state.turn
                  && this.props.currentPlayer >= state.currentPlayer
                  && !state.click
                )
              )
            )
              return

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
    const currentPlayerColor = this.props.players[this.props.currentPlayer].color
    const iAmIn = this.props.players.some(player => player.address === playerAddr)
    const itIsYou = this.props.players[this.props.currentPlayer].address === playerAddr
    return (
      <div className="app">
        <header className="header">
          <div className="logo">
            <Ball color="#0099ff" clicksToBlow={3} className="large-ball" />
          </div>
          <h1 className="title">Chain Reaction {this.props.cols} cols x {this.props.rows} rows</h1>
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
          </div>
          : <>
            {currentActivePlayers.length === this.props.players.length
              ? <div className="intro">
                <div className="player-row">
                  <div className="logo">
                    <Ball color={currentPlayerColor} clicksToBlow={3} className="large-ball" />
                  </div>
                  {this.props.gameEnded
                    ? <span className="victory">{`${itIsYou ? 'You' : currentPlayerName} won!`}</span>
                    : <span>{`${itIsYou ? 'Your' : currentPlayerName} turn.`}</span>
                  }
                </div>
              </div>
              : <div className="intro">
                <span>{currentActivePlayers.length} of {this.props.players.length} players are ready</span><br />
                <PlayerList players={this.props.players} />
                {iAmIn
                  && <span>Waiting for the other players to start</span>
                }
              </div>}
            <p className="button-toolbar">
              {currentActivePlayers.length !== this.props.players.length
                && <button
                  className="join-btn"
                  onClick={this.joinGame}
                  disabled={iAmIn}>
                  Join
                </button>}
              {(iAmIn && (this.props.turn > 0 || this.props.currentPlayer > 0))
                && <button
                  className="join-btn"
                  onClick={this.resend}
                  disabled={currentActivePlayers.length !== this.props.players.length}>
                  Send again
                </button>}
            </p>
            <GameGrid />
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
    modifyPlayer: (nick: string, address: string) => {
      dispatch(modifyPlayer(nick, address))
    },
  }
}

const mapStateToProps = (state) => {
  // console.log(state.game.present)
  return {
    currentPlayer: state.game.currentPlayer,
    rows: state.game.rows,
    cols: state.game.cols,
    grid: state.game.grid,
    gameEnded: state.game.gameEnded,
    playerName: state.game.playerName,
    playerAddr: state.game.playerAddr,
    players: state.game.players,
    gameStarted: state.game.gameStarted,
    turn: state.game.turn,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
