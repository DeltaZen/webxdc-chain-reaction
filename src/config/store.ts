import { applyMiddleware, legacy_createStore as createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import reducers from '../reducers'

export const sagaMiddleware = createSagaMiddleware()

function configureStore(persistedState) {
  return createStore(
    reducers,
    persistedState,
    applyMiddleware(sagaMiddleware),
  )
}

export default configureStore
