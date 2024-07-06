import React from 'react';
import ItemCard from '../ItemCard';

import './index.scss';

export default function OwnedPage({ userNftLists }: any) {
  return (
    <>
      {userNftLists?.length > 0 ? (
        <div className='item-list-wrap'>
          {userNftLists?.map((v, i) => (
            <div key={i}>
              <ItemCard item={v} />
            </div>
          ))}
        </div>
      ) : (
        <div>nothing here ...</div>
      )}
    </>
  );
}
