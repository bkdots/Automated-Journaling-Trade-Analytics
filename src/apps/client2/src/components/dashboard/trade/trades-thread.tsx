"use client";

import * as React from 'react';
import { useState } from 'react';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from "@mui/material/Typography";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

export function TradesThread() {
    const [isEditing, setIsEditing] = useState(false);

    // Toggle edit mode on and off
    const toggleEdit = () => setIsEditing(!isEditing);

    // Placeholder function for delete logic
    const handleDelete = () => {
        alert('Delete functionality not implemented.');
    };

    // Placeholder function for save logic
    const handleSave = () => {
        alert('Save functionality not implemented.');
        setIsEditing(false); // Exit editing mode after saving
    };

    return (
        <Paper elevation={3} className="MuiContainer-root MuiContainer-maxWidthLg mui-1qsxih2">
            <Card>
                <CardHeader
                    title="Notes"
                    subheader="September 14, 2016"
                />
                <CardMedia
                    component="img"
                    height="194"
                    image="/static/images/cards/paella.jpg"
                    alt="Paella dish"
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        This impressive paella is a perfect party dish and a fun meal to cook
                        together with your guests. Add 1 cup of frozen peas along with the mussels,
                        if you like.
                    </Typography>
                    {isEditing ? (
                        <TextField
                            id="outlined-basic"
                            label="TradingView Link"
                            variant="outlined"
                            defaultValue="http://"
                            fullWidth
                        />
                    ) : (
                        <Typography>TradingView Link: http://...</Typography>
                    )}
                </CardContent>
                <CardActions disableSpacing>
                    {isEditing ? (
                        <IconButton aria-label="save" onClick={handleSave}>
                            <SaveIcon />
                        </IconButton>
                    ) : (
                        <>
                            <IconButton aria-label="edit" onClick={toggleEdit}>
                                <EditIcon />
                            </IconButton>
                            <IconButton aria-label="delete" onClick={handleDelete}>
                                <DeleteIcon />
                            </IconButton>
                        </>
                    )}
                </CardActions>
            </Card>
        </Paper>
    );
}
