import { useState, useRef, useEffect } from 'react';
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
      <div>wallet</div>
    </div>
  );
}

export default Nav;
