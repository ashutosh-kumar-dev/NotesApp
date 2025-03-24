import * as React from 'react';
import Box from '@mui/joy/Box';
import Textarea from '@mui/joy/Textarea';
import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import Typography from '@mui/joy/Typography';
import Divider from '@mui/joy/Divider';
import Button from '@mui/joy/Button';
import Add from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';

const Notes = () => {
    const [notes, setNotes] = React.useState([]); 
    const [newNoteTitle, setNewNoteTitle] = React.useState("");
    const [newNoteDescription, setNewNoteDescription] = React.useState("");
    const jwt = localStorage.getItem("JWT");

    const handleLogOut = () => {
        localStorage.removeItem("JWT");
    };

    const fetchNotes = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/notes/get-all-notes`, {
                headers: { Authorization: `Bearer ${jwt}` }
            });
            setNotes(res.data); 
        } catch (e) {
            console.error("Error fetching notes:", e);
        }
    };

    const handleAddNote = async () => {
        if (!newNoteTitle.trim() || !newNoteDescription.trim()) {
            alert("Both title and description are required!");
            return;
        }

        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/notes/add-note`,
                { title: newNoteTitle, description: newNoteDescription },
                { headers: { Authorization: `Bearer ${jwt}` } }
            );

            setNewNoteTitle(""); // Clear input
            setNewNoteDescription(""); // Clear textarea
            fetchNotes(); // Refresh notes list
        } catch (e) {
            console.error("Error adding note:", e);
        }
    };

    React.useEffect(() => {
        fetchNotes();
    }, []);

    return (
        <div>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "99vh",
                    paddingTop: "50px",
                    textAlign: "center",
                    width: "99%",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 10px rgba(71, 13, 13, 0.1)",
                    backgroundColor: "white",
                }}
            >
                {/* Input Section */}
                <section>
                    <div>
                        <input
                            type="text"
                            placeholder="Notes Title"
                            value={newNoteTitle}
                            onChange={(e) => setNewNoteTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <Box sx={{ py: 2, display: "grid", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                            <Textarea
                                minRows={3}
                                name="Soft"
                                placeholder="Enter Your Note"
                                variant="soft"
                                value={newNoteDescription}
                                onChange={(e) => setNewNoteDescription(e.target.value)}
                            />
                        </Box>
                    </div>
                    <Button
                        sx={{ borderRadius: "5px", width: "100px" }}
                        startDecorator={<Add />}
                        onClick={handleAddNote}
                    >
                        Add Note
                    </Button>

                    <IconButton color="primary" onClick={fetchNotes}>
                        <RefreshIcon />
                    </IconButton>
                </section>

                {/* Notes List */}
                <Box
                    sx={{
                        maxHeight: "50vh",
                        overflowY: "auto",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "10px",
                        width: "80%",
                    }}
                >
                    <List variant="outlined" sx={{ minWidth: 240, borderRadius: "sm" }}>
                        {notes.length > 0 ? (
                            notes.map(({ id, title, description }) => (
                                <React.Fragment key={id}>
                                    <ListItem sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        {/* Title */}
                                        <Typography
                                            level="title-md"
                                            sx={{
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                maxWidth: "150px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {title}
                                        </Typography>

                                        <Divider orientation="vertical" />

                                        {/* Description */}
                                        <Typography
                                            level="body-md"
                                            sx={{
                                                maxHeight: "50px",
                                                overflowY: "auto",
                                                flex: 1,
                                            }}
                                        >
                                            {description}
                                        </Typography>
                                    </ListItem>
                                    <ListDivider inset="default" />
                                </React.Fragment>
                            ))
                        ) : (
                            <Typography sx={{ textAlign: "center", color: "gray" }}>No notes available</Typography>
                        )}
                    </List>
                </Box>

                {/* Logout Button */}
                <button type="button" onClick={handleLogOut}>
                    Logout
                </button>
            </Box>
        </div>
    );
};

export default Notes;
