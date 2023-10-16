import React, {FC, useState } from "react";
import { Box, TextField, Button, MenuItem } from '@mui/material';
import { JournalType, TagType } from '../../types/types';

interface ItemFormProps {
    type: 'journal' | 'tag';
    existingItem?: JournalType | TagType | null;
    onSave: (item: JournalType | TagType) => void;
    onCancel: () => void;
}

const ItemForm: FC<ItemFormProps> = ({ type, existingItem, onSave, onCancel }) => {
    const isJournal = type === 'journal';
    const isExistingJournal = isJournal && 'description' in (existingItem || {});
    const isExistingTag = !isJournal && 'tagCategory' in (existingItem || {});

    const [name, setName] = useState(existingItem?.name || '');
    const [description, setDescription] = useState(isExistingJournal ? (existingItem as JournalType).description : '');
    const [tagCategory, setTagCategory] = useState(isExistingTag ? (existingItem as TagType).tagCategory : '');

    const handleSave = () => {
        if (type === 'journal') {
            onSave({ name, description } as JournalType);
        } else {
            onSave({ name, tagCategory: tagCategory as 'setup' | 'mistake' } as TagType);
        }
    };

    return (
        <Box m="20px" p="10px" border="1px solid #ccc" borderRadius="4px">
            <TextField
                label={type === 'journal' ? "Journal Name" : "Tag Name"}
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
            />
            {type === 'journal' && (
                <TextField
                    label="Description"
                    variant="outlined"
                    multiline
                    rows={4}
                    fullWidth
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    margin="normal"
                />
            )}
            {type === 'tag' && (
                <TextField
                    label="Tag Category"
                    select
                    variant="outlined"
                    fullWidth
                    value={tagCategory}
                    onChange={(e) => setTagCategory(e.target.value as 'setup' | 'mistake')}
                    margin="normal"
                >
                    <MenuItem value="setup">Setup</MenuItem>
                    <MenuItem value="mistake">Mistake</MenuItem>
                </TextField>
            )}
            <Box display="flex" justifyContent="flex-end" mt="10px">
                <Button variant="outlined" onClick={onCancel} style={{ marginRight: '10px' }}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
            </Box>
        </Box>
    );
};

export default ItemForm;