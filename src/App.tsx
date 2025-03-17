import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TravelPlanner from './pages/TravelPlanner';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/planner" element={<TravelPlanner />} />
    </Routes>
  );
}

export default App;