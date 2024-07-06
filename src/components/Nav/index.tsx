import React from 'react';
import { Link } from 'react-router-dom';
import { ConnectWallet } from '../ConnectWallet';

import './index.scss';

function Nav() {
  return (
    <div className='nav-wrap'>
      <div className='home-title'>MarketPlace</div>
      <div className='route-wrap'>
        <Link className='nav-title' to={'/'}>
          Home
        </Link>
        <Link className='nav-title' to={'/owned'}>
          Owned
        </Link>
        <Link className='nav-title' to={'/create'}>
          Create
        </Link>
      </div>
      <ConnectWallet />
    </div>
  );
}

export default Nav;
