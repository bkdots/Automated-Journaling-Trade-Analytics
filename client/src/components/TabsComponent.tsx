import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

interface TabData {
    label: string;
    content: React.ReactNode;
    route: string;
    onClick?: () => void;
}

interface TabsComponentProps {
    tabs: TabData[];
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const TabsComponent: React.FC<TabsComponentProps> = ({ tabs }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const currentTabRoute = new URLSearchParams(location.search).get("tab");
    const value = tabs.findIndex(tab => tab.route === currentTabRoute);
    const activeValue = value !== -1 ? value : 0;

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        navigate(`?tab=${tabs[newValue].route}`);
    };

    React.useEffect(() => {
        if (!currentTabRoute) {
            navigate(`?tab=${tabs[0].route}`);
        }
    }, [currentTabRoute, navigate, tabs]);

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeValue} onChange={handleChange} aria-label="basic tabs example">
                    {tabs.map((tab, index) => (
                        <Tab key={index} label={tab.label} onClick={tab.onClick} {...a11yProps(index)} />
                    ))}
                </Tabs>
            </Box>
            {tabs.map((tab, index) => (
                <CustomTabPanel key={index} value={value} index={index}>
                    {tab.content}
                </CustomTabPanel>
            ))}
        </Box>
    );
}

export default TabsComponent;
