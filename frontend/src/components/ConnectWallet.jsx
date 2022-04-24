import React from 'react';
import { useEthers } from '@usedapp/core'

export const ConnectWallet = ({ style }) => {
    const { account, activateBrowserWallet } = useEthers();

    var res = !account
    ? (<button type='button' onClick={activateBrowserWallet}>Connect</button>)
    : (<span>Address: {account}</span>);

    return <div style={style}>{res}</div>;
}