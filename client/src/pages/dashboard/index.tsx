import {Routes, Route, useLocation} from 'react-router-dom';
import Header from "../../components/Header"
import {HeaderContentProvider} from "../../context/HeaderContent";
import {Box} from "@mui/material";
import Settings from "../auth/Settings";
import Journal from "../journal/index";
import React from "react";

const Dashboard = () => {
    const location = useLocation();

    let title = "DASHBOARD";
    let subtitle = "Welcome to your dashboard";

    // TODO add into header content context
    if (location.pathname.includes('journals')) {
        title = "JOURNALS";
        subtitle = "Your Journals";
    } else if (location.pathname.includes('settings')) {
        title = "SETTINGS";
        subtitle = "Your settings page";
    }

    return (
        <HeaderContentProvider>
            {(headerContent: React.ReactNode) => (
                <Box m="20px">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Header title={title} subtitle={subtitle} headerContent={headerContent}/>
                    </Box>
                    <Routes>
                        <Route path="settings" element={<Settings/>}/>
                        <Route path="journals" element={<Journal/>}/>
                    </Routes>
                </Box>
            )}
        </HeaderContentProvider>
    );
};

export default Dashboard;