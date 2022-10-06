// import { useEffect, useRef, useState } from 'react'
import { useMeasure } from 'react-use'
import range from 'lodash/range'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import GameCell from './GameCell'
import type { GameGridProps } from '~/interfaces'

const GameGrid = (props: GameGridProps) => {
  const [ref, { width }] = useMeasure<HTMLDivElement>()

  const style = {
    borderColor: 'grey',
    display: 'grid',
    height: width > 0 ? `${width * props.cols / props.rows}px` : 'auto',
    // gridTemplateRows: `repeat(${props.rows}, 1fr)`,
    gridTemplateColumns: `repeat(${props.cols}, 1fr)`,
  }
  if (props.currentPlayer)
    style.borderColor = props.currentPlayer.color

  // const lineMaxWidth = 500 / props.cols
  // const minHeight = `${50 * props.rows}px`
  return (
    <div className="game-grid" style={style} ref={ref}>
      {range(props.cols).map((col) => {
        return (
          <div className="game-line" key={`col-${col}`} style={{ gridTemplateRows: `repeat(${props.rows}, 1fr)` }}>
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
