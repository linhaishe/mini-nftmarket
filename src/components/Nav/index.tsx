import { useState, useRef, useEffect } from 'react';
import { Connector, useConnect } from 'wagmi';

import './index.scss';

function WalletOptions() {
  const { connectors, connect } = useConnect();

  return connectors.map((connector) => (
    <button key={connector.uid} onClick={() => connect({ connector })}>
      {connector.name}
    </button>
  ));
}

function Nav() {
  return (
    <div className='nav-wrap'>
      <div>MarketPlace</div>
      <div className='route-wrap'>
        <div>Home</div>
        <div>Own</div>
        <div>Create</div>
      </div>
      <WalletOptions />
    </div>
  );
}

export default Nav;
