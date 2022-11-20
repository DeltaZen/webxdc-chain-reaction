/* eslint-disable no-console */
import { call, put, takeEvery } from 'redux-saga/effects'
import { UPDATE_FULL_STATE, updateStateFailed, updateStateSucceeded } from './actions/game'
import GameLogic from './config/GameLogic'

function* updateFullState(action) {
  const state = action.payload
  try {
    console.log('running saga...')
    const logic = new GameLogic(state.rows, state.cols, state.players, state.grid)
    const gameState = yield call(() => logic.playTurn(state.click.x, state.click.y, state.currentPlayer, state.turn))
    console.log(gameState)
    const newState = { ...state, ...gameState }
    yield put(updateStateSucceeded(newState))
  }
  catch (e) {
    console.log(e)
    yield put(updateStateFailed(state))
  }
}

function* MySaga() {
  yield takeEvery(UPDATE_FULL_STATE, updateFullState)
}

export default MySaga
