import { Routes, Route } from 'react-router-dom';
import Header from "../../components/Header"
import { Box } from "@mui/material";
import Settings from "../auth/Settings";

const Dashboard = () => {

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="DASHBOARD" subtitle="Welcome to your dashboard"/>
            </Box>
            <Routes>
                <Route path="settings" element={<Settings />} />
            </Routes>
        </Box>
    );
};

export default Dashboard;