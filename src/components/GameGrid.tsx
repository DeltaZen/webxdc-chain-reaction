// import * as React from 'react'
import range from 'lodash/range'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import GameCell from './GameCell'
import type { GameGridProps } from '~/interfaces'

const GameGrid = (props: GameGridProps) => {
  const style = {
    borderColor: 'grey',
  }
  if (props.currentPlayer)
    style.borderColor = props.currentPlayer.color

  return (
    <div className="game-grid" style={style}>
      {range(props.rows).map((row) => {
        return (
          <div className="game-line" key={`row-${row}`}>
            {range(props.cols).map((col) => {
              return (
                <GameCell
                  key={`cell-${row}-${col}`}
                  x={row}
                  y={col}
                />
              )
            })}
          </div>
        )
      })}

    </div>
  )
}

// GameGrid.propTypes = {
//   rows: PropTypes.number,
//   cols: PropTypes.number,
// }

const mapStateToProps = (state) => {
  const { cols, rows, currentPlayer, players } = state.game.present
  return {
    cols,
    rows,
    currentPlayer: currentPlayer === -1 ? null : players[currentPlayer],
  }
}

export default connect(mapStateToProps)(GameGrid)
