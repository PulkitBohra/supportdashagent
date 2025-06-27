import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Support from './components/Support';
import Dashboard from './components/Dashboard';
import AgentInterface from './components/AgentInterface';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AgentInterface />} />
          <Route path="/support" element={<Support />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;