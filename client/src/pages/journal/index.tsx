import {Box, Button} from "@mui/material";
import TabsComponent from '../../components/TabsComponent';
import {useHeaderContent} from "../../context/HeaderContent";
import React from "react";

const Journal = () => {
    const setHeaderContent = useHeaderContent();

    React.useEffect(() => {
        if (setHeaderContent) {
            const content = (
                <>
                    <Button onClick={() => console.log("Clicked!")}>+ Add Journal</Button>
                    <span>Total Money: $5000</span>
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
                    { label: "Journals", content: <div>Content for Item One</div>, route: "journals" },
                    { label: "Tags", content: <div>Content for Item Two</div>, route: "tags"},
                ]}
            />
        </Box>
    );
};

export default Journal;

// import React, { useEffect, useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import {
//     Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow,
//     Button, TextField, IconButton, Tooltip, Links
// } from '@mui/material';
// import { Delete as DeleteIcon, Edit as EditIcon, Done as DoneIcon, Clear as ClearIcon } from '@mui/icons-material';
// import axios from 'axios';
// import { useStateContext } from '../contexts/ContextProvider';
//
// const Journals = () => {
//     const { user, journals, setJournals } = useStateContext();
//     const navigate = useNavigate();
//     const [journalName, setJournalName] = useState("");
//     const [journalDescription, setJournalDescription] = useState("");
//     const [editingJournalId, setEditingJournalId] = useState(null);
//
//     const apiConfig = (method = "GET", data = {}) => ({
//         method,
//         headers: {
//             Authorization: `Bearer ${user.token}`,
//         },
//         data
//     });
//
//     const fetchJournals = async () => {
//         try {
//             const { data } = await axios(apiConfig());
//             setJournals(data);
//         } catch (error) {
//             console.error(error);
//         }
//     };
//
//     useEffect(() => {
//         fetchJournals();
//     }, []);
//
//     return (
//         <div>
//             <Grid container spacing={3}>
//                 <Grid item xs={12}>
//                     <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
//                         <h2>Journals</h2>
//                         <Button variant="contained" onClick={() => navigate('/dashboard/journal/add')}>+ Create a Journal</Button>
//                         <JournalTable {...{ journals, editingJournalId, setEditingJournalId, setJournalName, setJournalDescription, journalName, journalDescription }} />
//                         <Links color="primary" href="#" onClick={(e) => e.preventDefault()} sx={{ mt: 3 }}>
//                             See more orders
//                         </Links>
//                     </Paper>
//                 </Grid>
//             </Grid>
//         </div>
//     );
// };
//
// const JournalTable = ({ journals, editingJournalId, setEditingJournalId, setJournalName, setJournalDescription, journalName, journalDescription }) => (
//     <Table size="small">
//         <TableHead>
//             <TableRow>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Description</TableCell>
//                 <TableCell>Actions</TableCell>
//             </TableRow>
//         </TableHead>
//         <TableBody>
//             {journals.map((journal) => (
//                 <JournalRow key={journal._id} {...{ journal, editingJournalId, setEditingJournalId, setJournalName, setJournalDescription, journalName, journalDescription }} />
//             ))}
//         </TableBody>
//     </Table>
// );
//
// const JournalRow = ({ journal, editingJournalId, setEditingJournalId, setJournalName, setJournalDescription, journalName, journalDescription }) => (
//     <TableRow key={journal._id}>
//         <TableCell>
//             {editingJournalId === journal._id ? (
//                 <TextField value={journalName} onChange={(e) => setJournalName(e.target.value)} />
//             ) : (
//                 journal.journalName
//             )}
//         </TableCell>
//         <TableCell>
//             {editingJournalId === journal._id ? (
//                 <TextField value={journalDescription} onChange={(e) => setJournalDescription(e.target.value)} />
//             ) : (
//                 journal.journalDescription
//             )}
//         </TableCell>
//         <TableCell>
//             {editingJournalId === journal._id ? (
//                 <>
//                     <Tooltip title="Done">
//                         <IconButton onClick={() => handleEditSubmit(journal._id)}>
//                             <DoneIcon />
//                         </IconButton>
//                     </Tooltip>
//                     <Tooltip title="Clear">
//                         <IconButton onClick={() => setEditingJournalId(null)}>
//                             <ClearIcon />
//                         </IconButton>
//                     </Tooltip>
//                 </>
//             ) : (
//                 <>
//                     <Tooltip title="Edit">
//                         <IconButton onClick={() => setEditingJournalId(journal._id)}>
//                             <EditIcon />
//                         </IconButton>
//                     </Tooltip>
//                     <Tooltip title="Delete">
//                         <IconButton onClick={() => handleDeleteSubmit(journal._id)}>
//                             <DeleteIcon />
//                         </IconButton>
//                     </Tooltip>
//                 </>
//             )}
//         </TableCell>
//     </TableRow>
// );
//
// // ... other code remains the same ...
//
// export default Journals;
