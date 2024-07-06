import { useState, useRef, useEffect } from 'react';
import './index.scss';

function ItemCard({ item }) {
  console.log('item', item);

  return (
    <div className='item-wrap'>
      <img
        src='https://images.freeimages.com/image/previews/477/sweet-flat-candy-png-5690113.png'
        className='nft-img'
      />
      <div className='user-info-wraps'>
        <img
          src='https://cdn-icons-png.flaticon.com/512/9693/9693244.png'
          className='avatar-img'
        />
        <div className='user-account-wrap-item-card'>
          <div className='user-names'>Creator</div>
          <div className='user-ids'>{item?.contract?.address}</div>
        </div>
      </div>
      <div className='item-card-nft-info'>
        <div className='item-card-nft-info-title'>{item?.metadata?.name}</div>
        <div className='item-card-nft-info-desc'>
          {item?.metadata?.description}
        </div>
      </div>
      <div className='item-card-price-info-wrap'>
        <div className='item-card-price-info'>
          <div className='item-card-price-info-price'>
            {item?.metadata?.price}
          </div>
          <div className='item-card-price-info-title'>Price</div>
        </div>
        <div className='action-btn'>Buy</div>
      </div>
      <div className='item-card-create-time'>{item?.timeLastUpdated}</div>
    </div>
  );
}

export default ItemCard;
