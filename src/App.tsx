import { useState, useRef, useEffect } from 'react';
import { WagmiProvider } from 'wagmi';
import { config } from './config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Nav from './components/Nav';
import ItemCard from './components/ItemCard';

import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div>
          <Nav />
          <ItemCard />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
