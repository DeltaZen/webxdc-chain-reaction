/* eslint-disable @typescript-eslint/no-unused-vars */
import range from 'lodash/range'

import { INIT_GAME, MODIFY_PLAYER, RESET_GAME, UPDATE_ADMIN_STATE, UPDATE_FULL_STATE_FAILED, UPDATE_FULL_STATE_SUCCEEDED } from '../actions/game'

import type { Player } from '../interfaces'

const playerName = window.webxdc.selfName
const playerAddr = window.webxdc.selfAddr

const INITIAL_STATE = {
  grid: {},
  currentPlayer: 0,
  players: [] as Player[],
  rows: 0,
  cols: 0,
  turn: 0,
  gameStarted: false,
  gameEnded: false,
  playerName,
  playerAddr,
}

const createEmptyGrid = (rows, cols) => {
  const grid = {}
  range(rows).forEach((rowIdx) => {
    const row = {}
    range(cols).forEach((colIdx) => {
      row[colIdx] = {
        player: -1,
        clicked: 0,
      }
    })
    grid[rowIdx] = row
  })

  return grid
}

const ressucitatePlayers = (players: Player[]) => {
  const newPlayers = [] as Player[]
  players.forEach((player) => {
    newPlayers.push({
      color: player.color,
      alive: true,
      nick: player.nick,
      address: player.address,
    })
  })

  return newPlayers
}

export const modifyPlayer = (players: Player[], nick: string, address: string) => {
  const index = players.findIndex(p => !p.address)
  if (index === -1)
    return players

  const newPlayers = players
  newPlayers[index].nick = nick
  newPlayers[index].address = address

  return newPlayers
}

const game = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INIT_GAME: {
      const { rows, cols, players } = action.payload
      const grid = createEmptyGrid(rows, cols)

      // send update as well
      const text = `${players[0].nick} created a Chain Reaction game. Join!`
      players[0]?.address && window.webxdc.sendUpdate({
        payload: {
          type: INIT_GAME,
          state: {
            grid,
            rows,
            cols,
            players,
            currentPlayer: 0,
            turn: 0,
            gameStarted: false,
            gameEnded: false,
          },
        },
        info: text,
      }, text)

      return {
        grid,
        rows,
        cols,
        players,
        currentPlayer: 0,
        turn: 0,
        gameStarted: false,
        gameEnded: false,
        playerName,
        playerAddr,
      }
    }
    case RESET_GAME: {
      const grid = createEmptyGrid(state.rows, state.cols)
      const players = ressucitatePlayers(state.players)

      return {
        ...state,
        grid,
        currentPlayer: 0,
        players,
        turn: 0,
        gameStarted: false,
        gameEnded: false,
        playerName,
        playerAddr,
      }
    }
    case MODIFY_PLAYER: {
      const { nick, address } = action.payload
      const { players } = state

      const text = `${nick} joined Chain Reaction game!`
      const newPlayers = modifyPlayer(players, nick, address)
      window.webxdc.sendUpdate({
        payload: {
          type: MODIFY_PLAYER,
          state: {
            ...state,
            players: newPlayers,
          },
        },
        info: text,
      }, text)

      if (!state.gameStarted) {
        return {
          ...state,
          players: newPlayers,
        }
      }

      return state
    }
    case UPDATE_FULL_STATE_SUCCEEDED: {
      const state = action.payload

      return {
        ...state, playerName, playerAddr,
      }
    }
    case UPDATE_FULL_STATE_FAILED: {
      const state = action.payload

      return {
        ...state, playerName, playerAddr,
      }
    }
    case UPDATE_ADMIN_STATE: {
      const state = action.payload

      // send update as well
      const text = state.click ? '[update with new move]' : '[update approved by admin]'
      state.gameStarted && window.webxdc.sendUpdate({
        payload: {
          type: UPDATE_ADMIN_STATE,
          state: {
            ...state,
          },
        },
      }, text)

      return {
        ...state, playerName, playerAddr,
      }
    }
    default:
      return state
  }
}

export default game
