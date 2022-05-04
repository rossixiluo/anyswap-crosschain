import React, { Suspense } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import Header from '../components/Header'
import NavList from '../components/Header/NavList'
import Polling from '../components/Header/Polling'
import URLWarning from '../components/Header/URLWarning'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import TxnsDtilsModal from '../components/CrossChainPanelV2/txnsDtilsModal'
import TxnsErrorTipModal from '../components/CrossChainPanelV2/txnsErrorTipModal'
// import Pool from './Pool'
// import Bridge from './Bridge'
import Dashboard from './Dashboard'

import CrossChain from './CrossChain'
import Bridge from './Bridge'

import MergeCrossChainV2 from './MergeCrossChainV2'
import Pools from './Pools'
import PoolList from './Pools/poolList'
import CrossChainTxns from './CrossChainTxns'
import CrossNFT from './CroseNFT'
import SwapMULTI from './SwapMULTI'
import Vest from './Vest'
import CreateLock from './Vest/create'
import MangerVest from './Vest/manger'

import ANYFarming from './Farms/ANYFarming'
import NoanyFarming from './Farms/NoanyFarming'
// import ETHtestfarming from './Farms/ETH_test_farming'
import FarmList from './Farms/FarmsList'

import HistoryList from './History'
import HistoryDetails from './History/details'
import NonApprove from '../components/NonApprove'
import QueryNonApprove from '../components/NonApprove/queryIsNeedNonApprove'

import config from '../config'
import farmlist from '../config/farmlist'

import { HashRouter } from 'react-router-dom'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import { NetworkContextName } from '../constants'
import getLibrary from '../utils/getLibrary'

import { WalletProvider, NetworkInfo } from '@terra-money/wallet-provider'
import { Updaters } from '../state/updaters'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

if ('ethereum' in window) {
  ;(window.ethereum as any).autoRefreshOnNetworkChange = false
}

const mainnet = {
  name: 'mainnet',
  chainID: 'columbus-4',
  lcd: 'https://lcd.terra.dev',
};

const testnet = {
  name: 'testnet',
  chainID: 'tequila-0004',
  lcd: 'https://tequila-lcd.terra.dev',
};

const walletConnectChainIds: Record<number, NetworkInfo> = {
  0: testnet,
  1: mainnet,
}

// import '../hooks/xrp'

// console.log(Sdk)
const AppWrapper = styled.div`
  // display: flex;
  // flex-flow: column;
  // align-items: flex-start;
  // overflow-x: hidden;
  width: 100%;
  height: 100%;
  // width: 100vw;
  // height: 100vh;
  position: relative;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  flex-wrap: wrap;
  width: 100%;
  // justify-content: space-between;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.contentShadow};
  background: ${({ theme }) => theme.contentBg};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
`

// const NavLeft = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   bottom: 0;
//   padding-top: 70px;
//   width: 320px;
//   box-shadow: ${({ theme }) => theme.contentShadow};
//   background: ${({ theme }) => theme.contentBg};
//   overflow: auto;
//   ${({ theme }) => theme.mediaWidth.upToMedium`
//     display:none;
//   `}
// `
const NavBottom = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  bottom: 0;
  padding-top: 0px;
  width: 100%;
  box-shadow: ${({ theme }) => theme.contentShadow};
  background: ${({ theme }) => theme.contentBg};
  overflow: auto;
  display: none;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display:block;
    z-index: 9;
  `}
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  // max-width: 1440px;
  max-width: 1100px;
  height: 100%;
  // height: 100vh;
  padding-top: 70px;
  // padding-left: 320px;
  position: relative;
  align-items: center;
  flex: 1;
  // overflow-y: auto;
  // overflow-x: hidden;
  z-index: 10;
  margin: auto;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 16px;
    padding-top: 2rem;
  `};

  z-index: 1;
`

const Marginer = styled.div`
  margin-top: 5rem;
`

// function TopLevelModals() {
//   const open = useModalOpen(ApplicationModal.ADDRESS_CLAIM)
//   const toggle = useToggleModal(ApplicationModal.ADDRESS_CLAIM)
//   return <AddressClaimModal isOpen={open} onDismiss={toggle} />
// }

export function App() {
  let initUrl = '/dashboard'
  if (config.getCurConfigInfo().isOpenRouter) {
    initUrl = '/v1/router'
  } else if (config.getCurConfigInfo().isOpenBridge) {
    initUrl = '/bridge'
  } else if (config.getCurConfigInfo().isOpenMerge) {
    initUrl = '/router'
  }
  return (
    <Suspense fallback={null}>
      {/* <Route component={GoogleAnalyticsReporter} /> */}
      {/* <Route component={DarkModeQueryParamReader} /> */}
      <AppWrapper>
        <HeaderWrapper>
          <URLWarning />
          <Header />
        </HeaderWrapper>
        <BodyWrapper>
          {/* <NavLeft>
            <NavList />
          </NavLeft> */}
          <Popups />
          <Polling />
          <TxnsDtilsModal />
          <TxnsErrorTipModal />
          <NonApprove />
          {/* <TopLevelModals /> */}
          <Web3ReactManager>
            <Switch>
              <Route exact strict path="/dashboard" component={() => <Dashboard />} />
              <Route exact strict path="/pool" component={() => <PoolList />} />
              <Route exact strict path="/pool/add" component={() => <Pools />} />
              <Route exact strict path="/farm" component={() => <FarmList />} />
              <Route exact strict path="/nft" component={() => <CrossNFT />} />
              <Route exact strict path="/cross-chain-txns" component={() => <CrossChainTxns />} />
              <Route exact strict path="/bridge" component={() => <Bridge />} />
              <Route exact strict path="/multi" component={() => <SwapMULTI />} />
              <Route exact strict path="/history" component={() => <HistoryList />} />
              <Route exact strict path="/history/details" component={() => <HistoryDetails />} />
              <Route exact strict path="/approvals" component={() => <QueryNonApprove />} />
              <Route exact strict path="/vest" component={() => <Vest />} />
              <Route exact strict path="/vest/create" component={() => <CreateLock />} />
              <Route exact strict path="/vest/manger" component={() => <MangerVest />} />
              <Route exact strict path={config.getCurConfigInfo().isOpenBridge ? "/v1/router" : "/swap"} component={() => <CrossChain />} />
  
              <Route
                path={[
                  '/router'
                ]}
                component={() => <MergeCrossChainV2 />}
              />
              {
                Object.keys(farmlist).map((key, index) => {
                  if (farmlist[key].farmtype === 'noany') {
                    return (
                      <Route exact strict path={'/' + farmlist[key].url} component={() => <NoanyFarming farmkey={key} />} key={index} />
                    )
                  }
                  return (
                    <Route exact strict path={'/' + farmlist[key].url} component={() => <ANYFarming farmkey={key} />} key={index} />
                  )
                })
              }
              <Redirect to={{ pathname: initUrl }} />
            </Switch>
          </Web3ReactManager>
          <Marginer />
          <NavBottom>
            <NavList />
          </NavBottom>
        </BodyWrapper>
      </AppWrapper>
    </Suspense>
  )
}

export default function AppContainer() {
  return (<WalletProvider
    defaultNetwork={mainnet}
    walletConnectChainIds={walletConnectChainIds}
  >
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Updaters />
        <HashRouter>
          <App />
        </HashRouter>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </WalletProvider>)
}