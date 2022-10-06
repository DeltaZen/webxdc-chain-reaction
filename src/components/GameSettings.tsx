import * as React from 'react'
import { connect } from 'react-redux'
import isNaN from 'lodash/isNaN'
import tinycolor from 'tinycolor2'
import { initGame } from '../actions/game'
import PlayerList from './PlayerList'
import { modifyPlayer } from '~/reducers/game'
import type { GameSettingsProps, GameSettingsState } from '~/interfaces'

class GameSettings extends React.Component<GameSettingsProps> {
  state: GameSettingsState
  constructor(props: GameSettingsProps) {
    super(props)
    this.state = {
      rows: props.rows,
      cols: props.cols,
      players: props.players,
      playerName: props.playerName,
      playerAddr: props.playerAddr,
    }
  }

  dimensionIsValid = (value) => {
    const parsed = parseInt(value, 10)

    if (isNaN(parsed))
      return false

    return parsed >= 3 && parsed <= 10
  }

  changeRows = (e) => {
    this.setState({
      rows: e.target.value,
    })
  }

  changeCols = (e) => {
    this.setState({
      cols: e.target.value,
    })
  }

  addPlayer = () => {
    if (this.state.players.length >= 6)
      return

    const players = this.state.players
    players.push({
      alive: true,
      color: tinycolor.random().toHexString(),
      nick: 'Available',
    })
    this.setState({
      players,
    })
  }

  removePlayer = index => () => {
    if (this.state.players.length <= 2)
      return

    const players = this.state.players
    players.splice(index, 1)
    this.setState({
      players,
    })
  }

  changePlayerColor = index => (e) => {
    const color = tinycolor(e.target.value)
    if (!color.isValid())
      return

    const players = this.state.players
    players[index].color = color.toHexString()
    this.setState({
      players,
    })
  }

  changeSettings = () => {
    const { rows, cols } = this.state
    const rowsValue = this.dimensionIsValid(rows) ? parseInt(rows, 10) : this.props.rows
    const colsValue = this.dimensionIsValid(cols) ? parseInt(cols, 10) : this.props.cols
    const players = modifyPlayer(this.state.players, this.state.playerName, this.state.playerAddr)
    this.props.initGame(
      rowsValue,
      colsValue,
      players,
    )
    this.setState({
      rows: rowsValue,
      cols: colsValue,
      players: this.state.players,
    })
  }

  render() {
    const currentActivePlayers = this.state.players.filter(p => p.address)
    return (
      <div className={`settings ${this.props.show ? 'visible' : ''}`}>
        <div className="form">
          <div className="form-group">
            <label htmlFor="rows">Rows</label>
            <input
              onChange={this.changeRows}
              name="rows"
              type="number"
              min="3"
              max="10"
              value={this.state.rows}
            />
          </div>
          <div className="form-group">
            <label htmlFor="cols">Cols</label>
            <input
              onChange={this.changeCols}
              name="cols"
              type="number"
              min="3"
              max="10"
              value={this.state.cols}
            />
          </div>
          <PlayerList
            players={this.state.players}
            onChange={this.changePlayerColor}
            removePlayer={this.removePlayer}
          />
        </div>
        {this.state.players.length < 6 && <button onClick={this.addPlayer}>Add a player</button>}
        <p>{currentActivePlayers.length} of {this.state.players.length} players are ready!</p>
        <button onClick={this.changeSettings}>Create</button>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { players, rows, cols, playerName, playerAddr } = state.game

  return {
    players,
    rows,
    cols,
    playerName,
    playerAddr,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initGame: (rows, cols, players) => {
      dispatch(initGame(rows, cols, players))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameSettings)
