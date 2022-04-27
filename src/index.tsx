import 'inter-ui'
import React, { StrictMode } from 'react'
// import { isMobile } from 'react-device-detect'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import './i18n'
import store from './state'
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle, ThemeGlobalClassName } from './theme'
import AppContainer from './pages/AppContainer'

import './assets/css/index.scss'

ReactDOM.render(
  <StrictMode>
  <Provider store={store}>
    <FixedGlobalStyle />
    <ThemeProvider>
      <ThemeGlobalClassName />
      <ThemedGlobalStyle />
        <AppContainer />
    </ThemeProvider>
  </Provider>
  </StrictMode>,
  document.getElementById('root')
)
