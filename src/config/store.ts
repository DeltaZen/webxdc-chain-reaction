import { applyMiddleware, legacy_createStore as createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import reducers from '../reducers'
// import MySaga from '~/sagas'

export const sagaMiddleware = createSagaMiddleware()

function configureStore(persistedState) {
  return createStore(
    reducers,
    persistedState,
    applyMiddleware(sagaMiddleware),
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  )
}

export default configureStore
