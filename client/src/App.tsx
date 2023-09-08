import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { Account } from "./Account";
import Status from "./Status";

function App() {
  return (
    <div className="App">
        <BrowserRouter>
            <Account>
                <Status />
                <Routes>
                    <Route path="/signup" element={<Signup/>}/>
                    <Route path="/login" element={<Login/>}/>
                </Routes>
            </Account>
        </BrowserRouter>
    </div>
  );
}

export default App;
