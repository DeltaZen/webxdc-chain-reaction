import type { UpdateState } from '~/interfaces'

export const INIT_GAME = 'INIT_GAME'
export const RESET_GAME = 'RESET_GAME'
export const CLICK_CELL = 'CLICK_CELL'
export const MODIFY_PLAYER = 'MODIFY_PLAYER'
export const UPDATE_FULL_STATE = 'UPDATE_FULL_STATE'
export const UPDATE_ADMIN_STATE = 'UPDATE_ADMIN_STATE'

const ROWS = 6
const COLS = 6
const PLAYERS = [
  {
    color: '#FF0000',
    alive: true,
    nick: 'Player 1',
  },
  {
    color: '#1EF127',
    alive: true,
    nick: 'Player 2',
  },
]

export const initGame = (rows = ROWS, cols = COLS, players = PLAYERS) => {
  return {
    type: INIT_GAME,
    payload: {
      rows,
      cols,
      players,
    },
  }
}

export const resetGame = () => {
  return {
    type: RESET_GAME,
  }
}

export const clickCell = (x, y) => {
  return {
    type: CLICK_CELL,
    payload: {
      x,
      y,
    },
  }
}

export const modifyPlayer = (nick: string, address: string) => {
  return {
    type: MODIFY_PLAYER,
    payload: {
      nick,
      address,
    },
  }
}

export const updateState = (state: UpdateState) => {
  return {
    type: UPDATE_FULL_STATE,
    payload: { ...state },
  }
}

export const updateAdminState = (state: UpdateState) => {
  return {
    type: UPDATE_ADMIN_STATE,
    payload: { ...state },
  }
}
