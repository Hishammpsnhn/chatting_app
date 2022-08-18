import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from './pages/Home'
import Chat from './pages/Chat'
function App() {

  return (
    <div className="App">
    
        <Routes>
          <Route path="/" element={<Home />}> </Route>
          <Route path="/chat" element={<Chat />}> </Route>
        </Routes>
       
     
    </div>
  );
}

export default App;
