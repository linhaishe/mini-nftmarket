import { useState, useRef, useEffect } from 'react';
import Nav from './components/Nav';
import ItemCard from './components/ItemCard';

import './App.css';

function App() {
  return (
    <div>
      <Nav />
      <ItemCard />
    </div>
  );
}

export default App;
