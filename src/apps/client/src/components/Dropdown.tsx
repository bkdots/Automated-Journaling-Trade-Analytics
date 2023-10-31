import React from 'react';
import { Menu, MenuItem } from '@mui/material';

interface DropdownProps {
    anchorEl: null | HTMLElement;
    onClose: () => void;
    items: { label: string; value: string }[];
    onSelect: (item: { label: string; value: string }) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ anchorEl, onClose, items, onSelect }) => {
    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={onClose}
        >
            {items.map((item, index) => (
                <MenuItem
                    key={index}
                    onClick={() => {
                        onSelect(item);
                        onClose();
                    }}
                >
                    {item.label}
                </MenuItem>
            ))}
        </Menu>
    );
};

export default Dropdown;