import { useState, useRef, useEffect } from 'react';
import { WagmiProvider, useAccount } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ethers } from 'ethers';

import { config } from './config';
import MarketAbi from './backend/contractsData/Market.json';
import MarketAddress from './backend/contractsData/Market-address.json';
import NFTMAbi from './backend/contractsData/NFTM.json';
import NFTMAddress from './backend/contractsData/NFTM-address.json';
import SadMonkeyAbi from './backend/contractsData/SadMonkey.json';
import SadMonkeyAddress from './backend/contractsData/SadMonkey-address.json';

import Nav from './components/Nav';
import ItemCard from './components/ItemCard';
import Home from './components/Home';
import Create from './components/Create';

import './App.css';

const queryClient = new QueryClient();

function App() {
  // const { address } = useAccount();
  const [nft, setNFT] = useState({});
  const [marketplace, setMarketplace] = useState({});
  const [erc20Contract, setErc20Contract] = useState({});

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
    console.log('marketplace', marketplace);
    console.log('nft', nft);
    console.log('erc20', erc20);
    setErc20Contract(erc20);
  }, []);
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div>
          <Nav />
          <ItemCard />
          {/* <Home /> */}
          <Create
            marketplace={marketplace}
            nft={nft}
            erc20Contract={erc20Contract}
          />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
