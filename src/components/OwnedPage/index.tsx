import React, { useState } from 'react';
import ItemCard from '../ItemCard';
import ListToast from '../ListToast';

import './index.scss';

export default function OwnedPage({
  marketplace,
  setIsLoading,
  address,
  marketNftLists,
}: any) {
  const [isShow, setIsShow] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>({});
  const [itemId, setItemId] = useState<any>({});
  const marketplaceItems =
    marketNftLists?.filter(
      (item) => item?.seller?.toLowerCase() === address?.toLowerCase()
    ) || [];

  const onList = async (listingPrice) => {
    try {
      setIsLoading(true);
      const createSale = await marketplace.createSale(
        itemId,
        true,
        listingPrice
      );

      await createSale.wait();
    } catch (error) {
      alert(error);
    } finally {
      location.reload();
      setIsLoading(false);
    }
  };

  const onUnlist = async () => {
    try {
      setIsLoading(true);
      const unlistTransaction = await marketplace.unlistNFT(itemId);
      await unlistTransaction.wait();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      location.reload();
    }
  };

  const onClick = (itemInfo) => {
    setCurrentItem(itemInfo);
    setIsShow(true);
    setItemId(itemInfo?.itemId);
  };

  return (
    <>
      {marketplaceItems?.length > 0 ? (
        <div className='item-list-wrap'>
          {marketplaceItems?.map((v, i) => {
            return (
              <div key={i}>
                <ItemCard
                  item={v}
                  actionFunc={onClick}
                  buttonText={v.isUpForSale ? 'unList' : 'List'}
                  ownerAddress={address}
                  personTitle={'Owner'}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div>nothing here ...</div>
      )}
      <ListToast
        isShow={isShow}
        setIsShow={setIsShow}
        onConfirm={currentItem?.isUpForSale ? onUnlist : onList}
        isUpForSale={currentItem?.isUpForSale}
      />
    </>
  );
}
