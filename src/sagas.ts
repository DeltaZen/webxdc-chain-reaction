import { all, call, put, select, takeEvery } from 'redux-saga/effects'
import { CLICK_CELL, UPDATE_FULL_STATE, updateStateFailed, updateStateSucceeded } from './actions/game'
import GameLogic from './config/AsyncGameLogic'

const getGame = state => state.game
const playerAddr = window.webxdc.selfAddr

function* updateFullState(action) {
  const state = action.payload
  try {
    // show moves only if you are not who played
    const showMoves = state.click?.addr !== playerAddr
    const logic = new GameLogic(state.rows, state.cols, state.players, state.grid, showMoves)
    const gameState = yield call(async () => await logic.playTurn(state.click.x, state.click.y, state.currentPlayer, state.turn))
    const newState = { ...state, ...gameState }
    // eslint-disable-next-line no-console
    // console.log('Player that clicked: ', state.click.addr, '\nCurrent: ', playerAddr)
    yield put(updateStateSucceeded(newState))
  }
  catch (e) {
    // eslint-disable-next-line no-console
    // console.log('No click info')

    yield put(updateStateFailed(state))
  }
}

function* clickCell(action) {
  try {
    const state = yield select(getGame)
    // console.log(state)
    const { x, y } = action.payload
    if (!state.gameEnded) {
      const logic = new GameLogic(state.rows, state.cols, state.players, state.grid, true)
      const gameState = yield call(async () => await logic.playTurn(x, y, state.currentPlayer, state.turn))
      //   console.log(gameState)

      // send update as well
      const text = gameState.gameEnded ? `${gameState.players[gameState.currentPlayer].nick} won!` : `It's ${gameState.players[gameState.currentPlayer].nick} turn`
      window.webxdc.sendUpdate({
        payload: {
          type: CLICK_CELL,
          state: {
            ...state,
            // ...newState,
            click: {
              x,
              y,
              addr: playerAddr,
            },
          },
        },
        info: text,
      }, text)
      // eslint-disable-next-line no-console
      // console.log('Player that clicked: ', playerAddr)
      yield put(updateStateSucceeded({ ...state, ...gameState }))
    }
    else {
      yield put(updateStateSucceeded(state))
    }
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
  }
}

function* MySaga() {
  yield all([takeEvery(UPDATE_FULL_STATE, updateFullState), takeEvery(CLICK_CELL, clickCell)])
}

export default MySaga
