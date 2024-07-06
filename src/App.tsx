import { useState, useRef, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MarketAbi from './backend/contractsData/Market.json';
import MarketAddress from './backend/contractsData/Market-address.json';
import NFTMAbi from './backend/contractsData/NFTM.json';
import NFTMAddress from './backend/contractsData/NFTM-address.json';
import SadMonkeyAbi from './backend/contractsData/SadMonkey.json';
import SadMonkeyAddress from './backend/contractsData/SadMonkey-address.json';
import { getNfts } from './utils';
import Nav from './components/Nav';
import Home from './components/Home';
import Create from './components/Create';
import OwnedPage from './components/OwnedPage';

import './App.css';

function App() {
  const { address } = useAccount();
  const [nft, setNFT] = useState({});
  const [marketplace, setMarketplace] = useState({});
  const [erc20Contract, setErc20Contract] = useState({});
  const [marketNftLists, setMarketNftLists] = useState([]);
  const [userNftLists, setUserNftLists] = useState([]);

  const getNftLists = async (marketAddress, walletAddress) => {
    console.log('999', marketAddress, walletAddress);

    if (!marketAddress || !walletAddress) {
      return;
    }

    if (marketAddress) {
      const res: any = await getNfts(marketAddress);
      setMarketNftLists(res?.ownedNfts);
    }

    if (walletAddress) {
      const res: any = await getNfts(walletAddress);
      setUserNftLists(res?.ownedNfts);
    }
  };

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Set signer
    const signer = provider.getSigner();
    const marketplace = new ethers.Contract(
      MarketAddress.address,
      MarketAbi.abi,
      signer
    );
    const nft = new ethers.Contract(NFTMAddress.address, NFTMAbi.abi, signer);
    const erc20 = new ethers.Contract(
      SadMonkeyAddress.address,
      SadMonkeyAbi.abi,
      signer
    );
    setMarketplace(marketplace);
    setNFT(nft);
    setErc20Contract(erc20);
  }, []);

  useEffect(() => {
    getNftLists(marketplace.address, address);
  }, [marketplace, address]);

  return (
    <BrowserRouter>
      <div className='App'>
        <>
          <Nav />
        </>
        <div>
          <Routes>
            <Route
              path='/'
              element={
                <Home
                  marketplace={marketplace}
                  nft={nft}
                  erc20Contract={erc20Contract}
                  marketNftLists={marketNftLists}
                />
              }
            />
            <Route
              path='/create'
              element={
                <Create
                  marketplace={marketplace}
                  nft={nft}
                  erc20Contract={erc20Contract}
                />
              }
            />
            <Route
              path='/owned'
              element={<OwnedPage userNftLists={userNftLists} />}
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
