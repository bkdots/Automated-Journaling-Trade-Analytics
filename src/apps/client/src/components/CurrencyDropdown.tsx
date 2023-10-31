import React, { useState } from 'react';
import { Button } from '@mui/material';
import Dropdown from './Dropdown';
import { useCurrency, Currency } from '../context/currency';

const CurrencyDropdown: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { currentCurrency, setCurrency } = useCurrency();

    const currencies = [
        { label: "USD", value: "USD" },
        { label: "CAD", value: "CAD" },
        { label: "GBP", value: "GBP" },
        { label: "EUR", value: "EUR" },
    ];

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelect = (item: { label: string; value: string }) => {
        setCurrency(item.value as Currency);
    };

    return (
        <div>
            <Button onClick={handleOpen}>
                {currentCurrency}
            </Button>
            <Dropdown
                anchorEl={anchorEl}
                onClose={handleClose}
                items={currencies}
                onSelect={handleSelect}
            />
        </div>
    );
};

export default CurrencyDropdown;