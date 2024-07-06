import React, { useState } from 'react';
import { ethers } from 'ethers';
import ItemCard from '../ItemCard';

export default function Home({ marketNftLists }: any) {
  console.log('marketNftLists', marketNftLists);

  return (
    <>
      {marketNftLists?.length > 0 ? (
        <div>
          {marketNftLists?.map((v, i) => (
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
