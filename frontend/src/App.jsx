import React from "react";
import { Main } from './components/Main';

import {
  Rinkeby,
  ArbitrumRinkeby,
  DAppProvider,
} from '@usedapp/core'
import { getDefaultProvider, providers } from 'ethers'

const PolygonMumbai = {
  chainId: 80001,
  rpc: 'https://rpc-mumbai.maticvigil.com/'
}

const configRinkeby = {
  readOnlyChainId: PolygonMumbai.chainId,
  readOnlyUrls: {
    [Rinkeby.chainId]: getDefaultProvider('rinkeby'),
    [ArbitrumRinkeby.chainId]: 'https://rinkeby.arbitrum.io/rpc',
    [PolygonMumbai.chainId]: PolygonMumbai.rpc
  },
}

export const App = () => {
    return (<DAppProvider config={configRinkeby}>
        <Main />
      </DAppProvider>)
}
