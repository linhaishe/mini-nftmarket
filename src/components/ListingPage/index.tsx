import React, { useState } from 'react';
import { BigNumber, ethers } from 'ethers';

import './index.scss';

const ListingPage = ({
  setIsLoading,
  marketplace,
  erc20Contract,
  address,
}: any) => {
  const [tokenId, setTokenId] = useState('');
  const [nftAddress, setNftAddress] = useState<any>('');
  const [listingPrice, setListingPrice] = useState<any>('');

  const getContractAbi = async (contractAddress) => {
    const response = await fetch(
      `https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${process.env.ETHERSCAN_API_KEY}`
    );
    const data = await response.json();
    return data.result;
  };

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

  const ListingToken = async () => {
    try {
      if (!tokenId || !nftAddress || !listingPrice) {
        alert('所有数据不能为空');
        return;
      }

      setIsLoading(true);

      const contractAbi = await getContractAbi(nftAddress);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(nftAddress, contractAbi, signer);

      const isApprovalForAll = await nftContract?.isApprovedForAll(
        address,
        marketplace.address
      );

      if (!isApprovalForAll) {
        // set approval for all to market through nft contract
        const approvalTransaction = await nftContract?.setApprovalForAll(
          marketplace.address,
          true
        );
        await approvalTransaction.wait();
      }

      const allowance = await erc20Contract?.allowance(
        address,
        marketplace.address
      );

      if (BigNumber.from(allowance).lt(BigNumber.from(listingPrice))) {
        const approve = await erc20Contract.approve(
          marketplace.address,
          listingPrice
        );

        await approve.wait();
      }

      let itemInfo;
      // tokenId不具有唯一性，查询应该增加nftContract的条件 hack 暂缓处理 todo
      itemInfo = await getMarketItemByTokenId(marketplace, tokenId);

      if (!itemInfo?.exists) {
        const addItemToMarket = await marketplace.addItemToMarket(
          tokenId,
          listingPrice,
          nftContract.address
        );
        await addItemToMarket.wait();
        itemInfo = await getMarketItemByTokenId(marketplace, tokenId);
      }

      const createSale = await marketplace.createSale(
        itemInfo?.itemId,
        true,
        listingPrice
      );
      await createSale.wait();
    } catch (error) {
      alert(error);
      console.log('error', error);
    } finally {
      setIsLoading(false);
      setTokenId('');
      setNftAddress('');
      setListingPrice('');
      location.reload();
    }
  };

  return (
    <div className='listing-form-wrap'>
      <div>Add NFT to Market and Listing it.</div>
      <div className='listing-form-input-wrap'>
        <input
          onChange={(e) => setTokenId(e.target.value)}
          type='text'
          placeholder='tokenId'
          value={tokenId}
        />
        <input
          onChange={(e) => setListingPrice(e.target.value)}
          type='text'
          placeholder='Listing Price (in erc20 token)'
          value={listingPrice}
        />
        <input
          type='text'
          onChange={(e) => setNftAddress(e.target.value)}
          placeholder='NFT Address'
          value={nftAddress}
        />
        <div className='nft-action-btn' onClick={ListingToken}>
          Add NFT to Market and Listing it.
        </div>
      </div>
    </div>
  );
};

export default ListingPage;
