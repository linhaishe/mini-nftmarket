import React, { useEffect, useState } from 'react';
import ItemCard from '../ItemCard';
import { BigNumber } from 'ethers';
import ListToast from '../ListToast';
import { hexToDecimal } from '../../utils';
import Loading from '../Loading';

import './index.scss';

export default function OwnedPage({
  userNftLists,
  nft,
  marketplace,
  erc20Contract,
  address,
}: any) {
  const [isShow, setIsShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTokenId, setCurrentTokenId] = useState<string | null>(null);

  const listingNFT = async (listingPrice) => {
    try {
      setIsLoading(true);

      const isApprovalForAll = await nft.isApprovedForAll(
        address,
        marketplace.address
      );

      if (!isApprovalForAll) {
        // set approval for all to market through nft contract
        const approvalTransaction = await nft.setApprovalForAll(
          marketplace.address,
          true
        );
        const approvalRes = await approvalTransaction.wait();
        console.log('approvalRes', approvalRes);
      }

      const allowance = await erc20Contract.allowance(
        address,
        marketplace.address
      );

      if (BigNumber.from(allowance._hex).toString() < listingPrice) {
        const approve = await erc20Contract.approve(
          marketplace.address,
          listingPrice
        );

        const approveRsp = await approve.wait();
        console.log('approveRsp', approveRsp);
      }

      let itemInfo;
      // 检查市场里是否已经有这个NFT, 如果没创建的话是不窜爱 iteminfo的，这样就拿不到itemId
      itemInfo = await marketplace.getMarketItemByTokenId(currentTokenId);
      console.log('isExist', itemInfo, itemInfo?.exists);

      if (!itemInfo?.isExist) {
        const addItemToMarket = await marketplace.addItemToMarket(
          currentTokenId,
          listingPrice
        );
        const addItemToMarketRes = await addItemToMarket.wait();
        console.log('addItemToMarketRes', addItemToMarketRes);
        itemInfo = await marketplace.getMarketItemByTokenId(currentTokenId);
        console.log('itemInfo', itemInfo);
      }

      const createSale = await marketplace.createSale(
        itemInfo?.itemId,
        true,
        listingPrice
      );
      const createSaleRes = await createSale.wait();
      console.log('createSaleRes', createSaleRes);
    } catch (error) {
      alert(error);
    } finally {
      location.reload();
    }
  };

  return (
    <>
      {userNftLists?.length > 0 ? (
        <div className='item-list-wrap'>
          {userNftLists?.map((v, i) => {
            if (v?.contract?.address !== nft.address.toLowerCase()) {
              return null;
            }

            return (
              <div key={i}>
                <ItemCard
                  item={v}
                  actionFunc={() => {
                    setIsShow(true);
                    setCurrentTokenId(hexToDecimal(v?.id?.tokenId));
                  }}
                  buttonText={'Sell'}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div>nothing here ...</div>
      )}
      <ListToast isShow={isShow} setIsShow={setIsShow} onConfirm={listingNFT} />
      <Loading isLoading={isLoading} />
    </>
  );
}
