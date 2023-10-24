import React, {useState} from 'react';
import { Box, Button } from '@mui/material';
import TabsComponent from '../../components/TabsComponent';
import {useHeaderContent} from "../../context/HeaderContent";
import { useParams } from "react-router-dom";

const JournalDetail = () => {
    const setHeaderContent = useHeaderContent();
    const [selectedTab, setSelectedTab] = useState<"openTrades" | "closedTrades">("openTrades");
    let { id } = useParams();
    const handleAddTrade = () => console.log('Add Trade');
    const handleMerge = () => console.log('Merge');
    const handleDuplicate = () => console.log('Duplicate');
    const handleDelete = () => console.log('Delete');
    const handleClearSection = () => console.log('Clear Section');
    const handleExportToExcel = () => console.log('Export to Excel');
    const handleAutoSizeColumns = () => console.log('Auto Size Columns');

    React.useEffect(() => {
        if (setHeaderContent) {
            const content = (
                <>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <Box>
                            <Button variant="outlined" onClick={handleAddTrade}>Add Trade</Button>
                            <Button variant="outlined" onClick={handleMerge}>Merge</Button>
                            <Button variant="outlined" onClick={handleDuplicate}>Duplicate</Button>
                            <Button variant="outlined" onClick={handleDelete}>Delete</Button>
                            <Button variant="outlined" onClick={handleClearSection}>Clear Section</Button>
                            <Button variant="outlined" onClick={handleExportToExcel}>Export to Excel</Button>
                            <Button variant="outlined" onClick={handleAutoSizeColumns}>Auto Size Columns</Button>
                        </Box>
                    </Box>
                </>
            );

            setHeaderContent(content);

            return () => setHeaderContent(null);
        }
    }, [setHeaderContent]);

    return (
        <Box m="20px">
            <TabsComponent
                tabs={[
                    {
                        label: "Open Trades",
                        content: <p>Open trades content here...</p>,
                        route: "open-trades"
                    },
                    {
                        label: "Concluded Trades",
                        content: <p>Concluded trades content here...</p>,
                        route: "concluded-trades"
                    }
                ]}
            />
        </Box>
    );
};

export default JournalDetail;
