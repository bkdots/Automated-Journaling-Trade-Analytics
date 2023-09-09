import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthenticationForm from "./pages/auth/AuthenticationForm";
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
                    <Route path="/signup" element={<AuthenticationForm mode="signup" />}/>
                    <Route path="/login" element={<AuthenticationForm mode="login" />}/>
                </Routes>
                <Settings />
            </Account>
        </BrowserRouter>
    </div>
  );
}

export default App;
