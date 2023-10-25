import React, {useState} from 'react';
import { Box, Button } from '@mui/material';
import TabsComponent from '../../components/TabsComponent';
import {useHeaderContent} from "../../context/HeaderContent";
import TradeTable from "../trade/TradeTable";
import { useParams } from "react-router-dom";
import {DirectionEnum, TagCategoryEnum, TradeType, TradeTypeEnum } from '../../types/types';

const fakeTrades: TradeType[] = [
    {
        id: '1',
        favorited: true,
        entryDate: '2023-09-01',
        exitDate: '2023-09-05',
        instrument: 'AAPL',
        tradeType: TradeTypeEnum.Spot,
        optionType: 'Call',
        setup: 'Breakout',
        tiltmeter: 'Neutral',
        direction: DirectionEnum.Long,
        quantity: 100,
        entryPrice: 150,
        exitPrice: 160,
        takeProfitPrice: 170,
        stopLossPrice: 145,
        feesInDollar: 5,
        gainOrLossInDollar: 1000,
        gainOrLossInPercent: 6.67,
        accountSizeInDollar: 20000,
        riskPlanned: 1,
        riskMultiple: 2,
        originalTakeProfitHit: true,
        entryTags: {id: '1', name: 'Strong Earnings', tagCategory: TagCategoryEnum.Setup},
        exitTags: {id: '2', name: 'Hit Stop Loss', tagCategory: TagCategoryEnum.Mistake},
        tradeManagementTags: {id: '3', name: 'Good Management', tagCategory: TagCategoryEnum.Management},
        pricePercentMove: 6,
        expiryDate: '2023-10-01',
        personalNotes: 'Great trade!'
    },
    {
        id: '2',
        favorited: false,
        entryDate: '2023-08-01',
        exitDate: '2023-08-02',
        instrument: 'MSFT',
        tradeType: TradeTypeEnum.Option,
        optionType: 'Put',
        setup: 'Breakdown',
        tiltmeter: 'Bearish',
        direction: DirectionEnum.Short,
        quantity: 50,
        entryPrice: 250,
        exitPrice: 240,
        takeProfitPrice: 235,
        stopLossPrice: 255,
        feesInDollar: 5,
        gainOrLossInDollar: 500,
        gainOrLossInPercent: 4,
        accountSizeInDollar: 30000,
        riskPlanned: 2,
        riskMultiple: 2.5,
        originalTakeProfitHit: true,
        entryTags: {id: '1', name: 'Failed Support', tagCategory: TagCategoryEnum.Setup},
        exitTags: {id: '2', name: 'Take Profit', tagCategory: TagCategoryEnum.Management},
        tradeManagementTags: {id: '3', name: 'No Mistakes', tagCategory: TagCategoryEnum.Mistake},
        pricePercentMove: -4,
        expiryDate: '2023-08-30',
        personalNotes: 'Successful short trade'
    },
    {
        id: '3',
        favorited: true,
        entryDate: '2023-09-01',
        exitDate: '2023-09-15',
        instrument: 'AAPL',
        tradeType: TradeTypeEnum.Spot,
        optionType: 'N/A',
        setup: 'Breakout',
        tiltmeter: 'Bullish',
        direction: DirectionEnum.Long,
        quantity: 30,
        entryPrice: 150,
        exitPrice: 160,
        takeProfitPrice: 165,
        stopLossPrice: 145,
        feesInDollar: 3,
        gainOrLossInDollar: 300,
        gainOrLossInPercent: 6.7,
        accountSizeInDollar: 20000,
        riskPlanned: 1.5,
        riskMultiple: 2,
        originalTakeProfitHit: false,
        entryTags: { id: '4', name: 'Above MA', tagCategory: TagCategoryEnum.Setup },
        exitTags: { id: '5', name: 'Partial TP', tagCategory: TagCategoryEnum.Management },
        tradeManagementTags: { id: '6', name: 'Partial TP', tagCategory: TagCategoryEnum.Management },
        pricePercentMove: 6.7,
        expiryDate: 'N/A',
        personalNotes: 'Partial TP, rest trailed'
    },
    {
        id: '4',
        favorited: false,
        entryDate: '2023-10-05',
        exitDate: '2023-10-10',
        instrument: 'GOOGL',
        tradeType: TradeTypeEnum.Future,
        optionType: 'N/A',
        setup: 'Pullback',
        tiltmeter: 'Neutral',
        direction: DirectionEnum.Short,
        quantity: 15,
        entryPrice: 2800,
        exitPrice: 2750,
        takeProfitPrice: 2700,
        stopLossPrice: 2850,
        feesInDollar: 4,
        gainOrLossInDollar: 750,
        gainOrLossInPercent: 1.8,
        accountSizeInDollar: 40000,
        riskPlanned: 2,
        riskMultiple: 1.5,
        originalTakeProfitHit: false,
        entryTags: { id: '7', name: 'High Volume', tagCategory: TagCategoryEnum.Setup },
        exitTags: { id: '8', name: 'Stop Trail', tagCategory: TagCategoryEnum.Management },
        tradeManagementTags: { id: '9', name: 'Early Exit', tagCategory: TagCategoryEnum.Mistake },
        pricePercentMove: -1.8,
        expiryDate: 'N/A',
        personalNotes: 'Exit early due to market volatility'
    },
];

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
                        content: <TradeTable trades={fakeTrades} />,
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
