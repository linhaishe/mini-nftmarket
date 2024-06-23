import { useState, useRef, useEffect } from 'react';
import './index.scss';

function ItemCard() {
  return (
    <div className='item-wrap'>
      <img
        src='https://images.freeimages.com/image/previews/477/sweet-flat-candy-png-5690113.png'
        className='avatar-img'
      />
      <div className='info-wrap'>
        <div>name</div>
        <div>desc</div>
        <div className='user-info'>
          <img
            src='https://images.freeimages.com/image/previews/477/sweet-flat-candy-png-5690113.png'
            className='user-info-img'
          />
          <span className='user-name'>name</span>
        </div>
      </div>
      <div className='action-btn'>sell</div>
    </div>
  );
}

export default ItemCard;
