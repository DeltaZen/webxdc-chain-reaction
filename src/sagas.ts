import { all, call, put, select, takeEvery } from 'redux-saga/effects'
import { CLICK_CELL, UPDATE_FULL_STATE, updateStateFailed, updateStateSucceeded } from './actions/game'
import GameLogic from './config/AsyncGameLogic'

const getGame = state => state.game

function* updateFullState(action) {
  const state = action.payload
  try {
    const logic = new GameLogic(state.rows, state.cols, state.players, state.grid)
    const gameState = yield call(async () => await logic.playTurn(state.click.x, state.click.y, state.currentPlayer, state.turn))
    const newState = { ...state, ...gameState }
    yield put(updateStateSucceeded(newState))
  }
  catch (e) {
    yield put(updateStateFailed(state))
  }
}

function* clickCell(action) {
  try {
    const state = yield select(getGame)
    // console.log(state)
    const { x, y } = action.payload
    if (!state.gameEnded) {
      const logic = new GameLogic(state.rows, state.cols, state.players, state.grid, false)
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
              addr: state.playerAddr,
            },
          },
        },
        info: text,
      }, text)
      yield put(updateStateSucceeded(state))
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
