import range from 'lodash/range'
import keys from 'lodash/keys'

import type { Player } from '~/interfaces'

function vibrate(ms = 100) {
  try {
    navigator.vibrate(ms)
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default class GameLogic {
  rows: number
  cols: number
  currentPlayer: number
  players: Player[]
  grid: any // FIXME
  x: number
  y: number
  turn: number
  cellsActivated: number
  turnPlayed = false

  constructor(rows, cols, players, grid) {
    this.rows = rows
    this.cols = cols
    this.currentPlayer = -1
    this.players = this.refreshPlayers(players)
    this.grid = this.refreshGrid(grid)
    this.x = -1
    this.y = -1
    this.turn = 0
    this.cellsActivated = 0
  }

  playTurn = async (x, y, currentPlayer, turn) => {
    this.currentPlayer = currentPlayer
    this.x = x
    this.y = y
    this.turn = turn

    await this.play()

    return {
      grid: this.grid,
      currentPlayer: this.currentPlayer,
      gameStarted: true,
      gameEnded: this.hasGameEnded(),
      players: this.players,
      turn: this.turn,
    }
  }

  getNextPlayer = () => {
    if (this.hasGameEnded())
      return this.currentPlayer

    let next: number
    do {
      if (this.currentPlayer < this.players.length - 1) {
        next = this.currentPlayer + 1
        continue
      }
      this.turn++
      next = 0
    } while (!this.players[next].alive)

    return next
  }

  play = async () => {
    const cell = this.grid[this.x][this.y]

    // If cell does not belongs to current player we don't do shit
    if (cell.player > -1 && cell.player !== this.currentPlayer)
      return

    vibrate(100)

    this.turnPlayed = true
    await this.activateCell(this.x, this.y)

    // we check who's dead
    if (this.turn > 0) {
      const alivePlayers = this.getAlivePlayers()

      this.players.forEach((player, index) => {
        if (!alivePlayers.includes(index))
          player.alive = false
      })
    }

    // something actually happened so we change the player
    this.currentPlayer = this.getNextPlayer()
  }

  activateCell = async (x, y) => {
    if (this.cellsActivated > 1000) {
      if (!this.hasGameEnded())
        throw new Error('Too many cells blew, the game can\'t take it.')

      return
    }

    // If cell is not gonna blow we just increase clicks number
    if (this.cellWillBlowIn(x, y) > 1) {
      this.increaseCellClicks(x, y)
      return
    }

    // Else we blow it
    await this.blowCell(x, y)
  }

  increaseCellClicks = (x, y) => {
    const cell = this.grid[x][y]
    this.grid[x][y] = {
      player: this.currentPlayer,
      clicked: cell.clicked + 1,
    }
  }

  blowCell = async (x, y) => {
    vibrate(200)
    // console.log('Activated cells: ', this.cellsActivated)
    this.cellsActivated++

    // blow current cell
    this.grid[x][y] = {
      player: -1,
      clicked: 0,
    }

    // add animation
    this.addAnimation(x, y)
    await sleep(500)

    const adjacentCells = this.getAdjacentCellsCoordinates(x, y)
    for (let i = 0; i < adjacentCells.length; i++) {
      const cell = adjacentCells[i]
      await this.activateCell(cell.x, cell.y)
    }
  }

  addAnimation = (x: number, y: number) => {
    const gameCell = document.querySelector(`.cell-${x}-${y}`)
    const color = this.players[this.currentPlayer].color
    if (gameCell) {
      // remove all element with class 'hide'
      const hidden = document.querySelectorAll('.hide')
      for (let i = 0; i < hidden.length; i++) {
        const element = hidden[i]
        element.classList.remove('hide')
      }

      if (x > 0) {
        const moveup = document.createElement('div')
        const upCell = document.querySelector(`.cell-${x - 1}-${y}`)
        if (upCell && upCell.firstElementChild)
          upCell.firstElementChild.classList.add('hide')

        moveup.style.background = `radial-gradient(circle at 30% 30%, ${color}, black)`
        moveup.classList.add('move', 'up')
        gameCell.appendChild(moveup)
        setTimeout(() => {
          gameCell.removeChild(moveup)
          if (upCell && upCell.firstElementChild)
            upCell.firstElementChild.classList.remove('hide')
        }, 500)
      }
      if (x < this.rows - 1) {
        const movedown = document.createElement('div')
        const downCell = document.querySelector(`.cell-${x + 1}-${y}`)
        if (downCell && downCell.firstElementChild)
          downCell.firstElementChild.classList.add('hide')
        movedown.style.background = `radial-gradient(circle at 30% 30%, ${color}, black)`
        movedown.classList.add('move', 'down')
        gameCell.appendChild(movedown)
        setTimeout(() => {
          gameCell.removeChild(movedown)
          if (downCell && downCell.firstElementChild)
            downCell.firstElementChild.classList.remove('hide')
        }, 500)
      }
      if (y < this.cols - 1) {
        const moveright = document.createElement('div')
        const rightCell = document.querySelector(`.cell-${x}-${y + 1}`)
        if (rightCell && rightCell.firstElementChild)
          rightCell.firstElementChild.classList.add('hide')
        moveright.style.background = `radial-gradient(circle at 30% 30%, ${color}, black)`
        moveright.classList.add('move', 'right')
        gameCell.appendChild(moveright)
        setTimeout(() => {
          gameCell.removeChild(moveright)
          if (rightCell && rightCell.firstElementChild)
            rightCell.firstElementChild.classList.remove('hide')
        }, 500)
      }
      if (y > 0) {
        const moveleft = document.createElement('div')
        const leftCell = document.querySelector(`.cell-${x}-${y - 1}`)
        if (leftCell && leftCell.firstElementChild)
          leftCell.firstElementChild.classList.add('hide')
        moveleft.style.background = `radial-gradient(circle at 30% 30%, ${color}, black)`
        moveleft.classList.add('move', 'left')
        gameCell.appendChild(moveleft)
        setTimeout(() => {
          gameCell.removeChild(moveleft)
          if (leftCell && leftCell.firstElementChild)
            leftCell.firstElementChild.classList.remove('hide')
        }, 500)
      }
    }
  }

  cellWillBlowIn = (x, y) => {
    const cell = this.grid[x][y]

    if (this.isCorner(x, y))
      return 2 - cell.clicked

    if (this.isSide(x, y))
      return 3 - cell.clicked

    return 4 - cell.clicked
  }

  isCorner = (x, y) => {
    if (x !== 0 && x !== this.rows - 1)
      return false

    if (y !== 0 && y !== this.cols - 1)
      return false

    return true
  }

  isSide = (x, y) => {
    if (x !== 0 && x !== this.rows - 1 && y !== 0 && y !== this.cols - 1)
      return false

    return true
  }

  getAdjacentCellsCoordinates = (x, y) => {
    const cells = [] as { x: number; y: number }[]

    if (x > 0) {
      cells.push({
        x: x - 1,
        y,
      })
    }

    if (x < this.rows - 1) {
      cells.push({
        x: x + 1,
        y,
      })
    }

    if (y > 0) {
      cells.push({
        x,
        y: y - 1,
      })
    }

    if (y < this.cols - 1) {
      cells.push({
        x,
        y: y + 1,
      })
    }

    return cells
  }

  hasGameEnded = () => {
    return this.turn > 0 && this.getAlivePlayers().length === 1
  }

  getAlivePlayers = () => {
    const alive = [] as number[]

    range(this.rows).forEach((row) => {
      range(this.cols).forEach((col) => {
        const player = this.grid[row][col].player
        if (player > -1 && !alive.includes(player))
          alive.push(player)
      })
    })

    return alive
  }

  refreshGrid = (oldGrid) => {
    const grid = {}
    keys(oldGrid).forEach((row) => {
      keys(oldGrid[row]).forEach((col) => {
        const cell = oldGrid[row][col]
        if (!grid[row])
          grid[row] = {}

        grid[row][col] = { ...cell }
      })
    })

    return grid
  }

  refreshPlayers = (oldPlayers: Player[]) => {
    const players = [] as Player[]
    oldPlayers.forEach((player) => {
      players.push({ ...player })
    })

    return players
  }
}
