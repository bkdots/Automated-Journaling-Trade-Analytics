import React, {FC, useEffect, useState } from "react";
import { Box, TextField, Button } from '@mui/material';

type JournalType = {
    name: string;
    description: string;
}

type TagType = {
    name: string;
    tagCategory: 'setup' | 'mistake';
}
interface JournalCardFormProps {
    existingJournal?: {
        name: string;
        description: string;
    } | null;
    onSave: (journal: { name: string, description: string }) => void;
    onCancel: () => void;
}
const JournalCardForm: FC<JournalCardFormProps> = ({ existingJournal, onSave, onCancel }) => {
    const [name, setName] = useState(existingJournal ? existingJournal.name : '');
    const [description, setDescription] = useState(existingJournal ? existingJournal.description : '');

    const handleSave = () => {
        onSave({ name, description });
    };

    useEffect(() => {
        if (existingJournal) {
            setName(existingJournal.name);
            setDescription(existingJournal.description);
        }
    }, [existingJournal]);

    return (
        <Box m="20px" p="10px" border="1px solid #ccc" borderRadius="4px">
            <TextField
                label="Journal Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
            />
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
            <Box display="flex" justifyContent="flex-end" mt="10px">
                <Button variant="outlined" onClick={onCancel} style={{ marginRight: '10px' }}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
            </Box>
        </Box>
    );
};

export default JournalCardForm;