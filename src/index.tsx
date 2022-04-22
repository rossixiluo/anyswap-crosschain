import 'inter-ui'
import React, { Suspense } from 'react'
// import { isMobile } from 'react-device-detect'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import './i18n'
import store from './state'
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle, ThemeGlobalClassName } from './theme'
import AppContainer from './pages/AppContainer'

import './assets/css/index.scss'

ReactDOM.render(
  <Provider store={store}>
    <FixedGlobalStyle />
    <ThemeProvider>
      <ThemeGlobalClassName />
      <ThemedGlobalStyle />
      {/* <StrictMode> */}
      <Suspense fallback={ null }>
        <AppContainer />
      </Suspense>
      {/* </StrictMode> */}
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
)
