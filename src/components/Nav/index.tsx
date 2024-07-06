import { useState, useRef, useEffect } from 'react';
import { Connector, useConnect } from 'wagmi';
import { ConnectWallet } from '../ConnectWallet';

import './index.scss';

function Nav() {
  return (
    <div className='nav-wrap'>
      <div className='home-title'>MarketPlace</div>
      <div className='route-wrap'>
        <div className='nav-title'>Home</div>
        <div className='nav-title'>Own</div>
        <div className='nav-title'>Create</div>
      </div>
      <ConnectWallet />
    </div>
  );
}

export default Nav;
