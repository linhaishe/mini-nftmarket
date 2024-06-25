import React, { useState } from 'react';
import { ethers } from 'ethers';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [nft, setNFT] = useState({});
  const [marketplace, setMarketplace] = useState({});

  return <div>index</div>;
}
