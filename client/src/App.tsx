import React from 'react';
import {Routes, Route} from 'react-router-dom';
import {ColorModeContext, useMode} from "./context/theme";
import {VisibleModeContext, useVisibility} from "./context/visible";
import {CssBaseline, ThemeProvider} from "@mui/material";
import AuthenticationForm from "./pages/auth/AuthenticationForm";
import {Account} from "./context/Account";
import Status from "./pages/Status";
import Settings from "./pages/Settings";
import Topbar from "./pages/global/Topbar";
import Sidebar from "./pages/global/Sidebar";
import Dashboard from "./pages/dashboard";

function App() {
    const [theme, colorMode] = useMode();
    const [isVisible, visibilityControls] = useVisibility();

    return (
        <ColorModeContext.Provider value={colorMode}>
            <VisibleModeContext.Provider value={{...visibilityControls, isVisible}}>
                <ThemeProvider theme={theme}>
                    <CssBaseline/>
                    <div className="App">
                        <Sidebar/>
                        <main className="content">
                            <Account>
                                <Topbar/>
                                <Status/>
                                <Routes>
                                    <Route path="/dashboard" element={<Dashboard/>}/>
                                    <Route path="/signup" element={<AuthenticationForm mode="signup"/>}/>
                                    <Route path="/login" element={<AuthenticationForm mode="login"/>}/>
                                </Routes>
                                <Settings/>
                            </Account>
                        </main>
                    </div>
                </ThemeProvider>
            </VisibleModeContext.Provider>
        </ColorModeContext.Provider>
    );
}

export default App;
