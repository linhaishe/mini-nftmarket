import { useState, useRef, useEffect } from 'react';
import { Connector, useConnect } from 'wagmi';
import { ConnectWallet } from '../ConnectWallet';

import './index.scss';

function Nav() {
  return (
    <div className='nav-wrap'>
      <div>MarketPlace</div>
      <div className='route-wrap'>
        <div>Home</div>
        <div>Own</div>
        <div>Create</div>
      </div>
      <ConnectWallet />
    </div>
  );
}

export default Nav;
