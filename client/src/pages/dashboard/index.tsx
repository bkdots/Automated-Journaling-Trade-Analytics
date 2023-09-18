import {Routes, Route, useLocation} from 'react-router-dom';
import Header from "../../components/Header"
import { Box } from "@mui/material";
import Settings from "../auth/Settings";
import Journal from "../journal/index";

const Dashboard = () => {
    const location = useLocation();

    let title = "DASHBOARD";
    let subtitle = "Welcome to your dashboard";

    if (location.pathname.includes('journals')) {
        title = "JOURNALS";
        subtitle = "Your Journals";
    } else if (location.pathname.includes('settings')) {
        title = "SETTINGS";
        subtitle = "Your settings page";
    }

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title={title} subtitle={subtitle}/>
            </Box>
            <Routes>
                <Route path="settings" element={<Settings />} />
                <Route path="journals" element={<Journal />} />
            </Routes>
        </Box>
    );
};

export default Dashboard;