import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import { Account } from "./context/Account";
import Status from "./pages/Status";
import Settings from "./pages/Settings";

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
                <Settings />
            </Account>
        </BrowserRouter>
    </div>
  );
}

export default App;
