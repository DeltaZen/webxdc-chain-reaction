// import * as React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { clickCell } from '../actions/game'
import GameLogic from '../config/GameLogic'
import Ball from './Ball'

import type { GameCellProps } from '~/interfaces'

const GameCell = ({
  clickCell,
  x,
  y,
  status,
  players,
  currentPlayer,
  clicksToBlow,
  gameEnded,
  playerAddr,
}: GameCellProps) => {
  const cellStyle = {
    borderColor: 'grey',
  }
  if (currentPlayer !== -1)
    cellStyle.borderColor = players[currentPlayer].color

  const isFull = players.filter(p => p.address).length === players.length

  // console.log(players[currentPlayer].address)
  const onCellClick = gameEnded || !isFull || (status.player !== -1 && status.player !== currentPlayer)
    ? null
    : players[currentPlayer].address === playerAddr ? clickCell : null

  return (
    <div className={`game-cell ${x}-${y}`} onClick={onCellClick} style={cellStyle}>
      {status.player !== -1
        ? <Ball
          color={players[status.player].color}
          clicksToBlow={clicksToBlow}
        />
        : null
      }
    </div>
  )
}

// GameCell.propTypes = {
//   x: PropTypes.number,
//   y: PropTypes.number,
//   clickCell: PropTypes.func,
//   status: PropTypes.object,
//   players: PropTypes.array,
//   currentPlayer: PropTypes.number,
//   clicksToBlow: PropTypes.number,
// }

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    clickCell: () => {
      dispatch(clickCell(ownProps.x, ownProps.y))
    },
  }
}

const mapStateToProps = (state, ownProps) => {
  const { rows, cols, players, grid, currentPlayer, gameEnded, playerAddr, gameStarted } = state.game
  const logic = new GameLogic(rows, cols, players, grid)
  return {
    status: grid[ownProps.x][ownProps.y],
    players,
    currentPlayer,
    clicksToBlow: logic.cellWillBlowIn(ownProps.x, ownProps.y),
    gameStarted,
    gameEnded,
    playerAddr,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameCell)
