import React, { useState } from 'react';
import ItemCard from '../ItemCard';
import { BigNumber } from 'ethers';
import ListToast from '../ListToast';
import { hexToDecimal } from '../../utils';

import './index.scss';

export default function OwnedPage({
  userNftLists,
  marketplace,
  setIsLoading,
  address,
  marketNftLists,
}: any) {
  const [isShow, setIsShow] = useState(false);
  const [currentTokenId, setCurrentTokenId] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<any>({});
  const marketplaceItems =
    marketNftLists?.filter(
      (item) => item?.seller?.toLowerCase() === address?.toLowerCase()
    ) || [];
  const showList = [...userNftLists, ...marketplaceItems];

  const getMarketItemByTokenId = async (contract, tokenId) => {
    try {
      const marketItem = await contract.getMarketItemByTokenId(tokenId);
      return marketItem;
    } catch (error: any) {
      console.error('Market item not found:', error.message);
      // 返回一个空的 MarketItem 或进行其他错误处理
      return null;
    }
  };

  const onList = async (listingPrice) => {
    try {
      setIsLoading(true);
      // tokenId不具有唯一性，查询应该增加nftContract的条件 hack 暂时这样处理
      const itemInfo = await getMarketItemByTokenId(
        marketplace,
        currentTokenId
      );

      // if (!itemInfo) {...}

      const createSale = await marketplace.createSale(
        itemInfo?.itemId,
        true,
        listingPrice
      );

      await createSale.wait();
    } catch (error) {
      alert(error);
    } finally {
      location.reload();
      setCurrentItem('');
      setIsLoading(false);
    }
  };

  const onUnlist = async () => {
    try {
      setIsLoading(true);
      const unlistTransaction = await marketplace.unlistNFT(
        Number(BigNumber.from(currentItem.itemId).toString())
      );
      await unlistTransaction.wait();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      // location.reload();
    }
  };

  return (
    <>
      {showList?.length > 0 ? (
        <div className='item-list-wrap'>
          {showList?.map((v, i) => {
            return (
              <div key={i}>
                <ItemCard
                  item={v}
                  actionFunc={() => {
                    setIsShow(true);
                    setCurrentTokenId(hexToDecimal(v?.id?.tokenId));
                    setCurrentItem(v);
                  }}
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
