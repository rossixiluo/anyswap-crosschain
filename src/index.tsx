import 'inter-ui'
import React, { Suspense } from 'react'
// import { isMobile } from 'react-device-detect'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import './i18n'
import store from './state'
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from './theme'
import Lazyload from './components/Lazyload/Lazyload'
const App =  Lazyload(() => import('./pages/App'))

ReactDOM.render(
  <Provider store={store}>
    <FixedGlobalStyle />
    <ThemeProvider>
      <ThemedGlobalStyle />
      {/* <StrictMode> */}
      <Suspense fallback={ null }>
        <App duration={ 400 } />
      </Suspense>
      {/* </StrictMode> */}
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
)
