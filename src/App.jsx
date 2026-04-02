import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import PlaceDetails from './Pages/PlaceDetails';
import Explore from './Pages/Explore';
import Planning from './Pages/Planning';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/place/:id" element={<PlaceDetails />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/planning" element={<Planning />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
