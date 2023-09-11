import React from 'react';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {ColorModeContext, useMode} from "./theme";
import {CssBaseline, ThemeProvider} from "@mui/material";
import AuthenticationForm from "./pages/auth/AuthenticationForm";
import {Account} from "./context/Account";
import Status from "./pages/Status";
import Settings from "./pages/Settings";
import Topbar from "./pages/global/Topbar";

function App() {
    const [theme, colorMode] = useMode();
    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="App">
                    <Topbar />
                    <BrowserRouter>
                        <Account>
                            <Status/>
                            <Routes>
                                <Route path="/signup" element={<AuthenticationForm mode="signup"/>}/>
                                <Route path="/login" element={<AuthenticationForm mode="login"/>}/>
                            </Routes>
                            <Settings/>
                        </Account>
                    </BrowserRouter>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
