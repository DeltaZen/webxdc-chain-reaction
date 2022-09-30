// import * as React from 'react'
import range from 'lodash/range'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import GameCell from './GameCell'
import type { GameGridProps } from '~/interfaces'

const GameGrid = (props: GameGridProps) => {
  const style = {
    borderColor: 'grey',
    display: 'grid',
    // gridTemplateRows: `repeat(${props.rows}, 1fr)`,
    gridTemplateColumns: `repeat(${props.cols}, 1fr)`,
  }
  if (props.currentPlayer)
    style.borderColor = props.currentPlayer.color

  // const lineMaxWidth = 500 / props.cols
  const minHeight = `${50 * props.rows}px`
  return (
    <div className="game-grid" style={style}>
      {range(props.cols).map((col) => {
        return (
          <div className="game-line" key={`col-${col}`} style={{ gridTemplateRows: `repeat(${props.rows}, 1fr)`, minHeight }}>
            {range(props.rows).map((row) => {
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
