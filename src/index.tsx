import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import keys from 'lodash/keys'
import App from './App'

import { store } from './config/store'
import { initGame } from './actions/game'

const tempState = localStorage.getItem('reduxState')
const persistedState
  = tempState
    ? JSON.parse(tempState)
    : {}

// const store = configureStore(persistedState)

store.subscribe(() => {
  localStorage.setItem('reduxState', JSON.stringify(store.getState()))
})

if (!keys(persistedState).length)
  store.dispatch(initGame())

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
