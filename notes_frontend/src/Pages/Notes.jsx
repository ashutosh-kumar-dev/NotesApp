import React, { useState, useEffect } from "react";
import Box from "@mui/joy/Box";
import Textarea from "@mui/joy/Textarea";
import List from "@mui/joy/List";
import ListDivider from "@mui/joy/ListDivider";
import ListItem from "@mui/joy/ListItem";
import Typography from "@mui/joy/Typography";
import Divider from "@mui/joy/Divider";
import Button from "@mui/joy/Button";
import Add from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/RefreshSharp";
import axios from "axios";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteDescription, setNewNoteDescription] = useState("");
  const [hoveredItem, setHoveredItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const jwt = localStorage.getItem("JWT");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/notes/get-all-notes`, {
        headers: { Authorization: `Bearer ${jwt}` },
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

      setNewNoteTitle("");
      setNewNoteDescription("");
      fetchNotes();
    } catch (e) {
      console.error("Error adding note:", e);
    }
  };

  const handleEditClick = (id, title, description) => {
    setEditingItem({ id, title, description });
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/notes/update-note/${id}`,
        {
          title: editingItem.title,
          description: editingItem.description,
        },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );

      setEditingItem(null);
      fetchNotes();
    } catch (e) {
      console.error("Error updating note:", e);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/notes/delete-note/${id}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      fetchNotes();
    } catch (e) {
      console.error("Error deleting note:", e);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", height: "99vh", paddingTop: "50px" }}>
      {/* Input Section */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <input
          type="text"
          placeholder="Notes Title"
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc", width: "250px" }}
        />
        <Textarea
          minRows={3}
          placeholder="Enter Your Note"
          variant="soft"
          value={newNoteDescription}
          onChange={(e) => setNewNoteDescription(e.target.value)}
          sx={{ width: "300px", borderRadius: "5px" }}
        />
        <Button sx={{ borderRadius: "5px", width: "100px" }} startDecorator={<Add />} onClick={handleAddNote}>
          Add Note
        </Button>

        <IconButton color="primary" onClick={fetchNotes}>
            <RefreshIcon />
          </IconButton>
      </Box>

      {/* Notes List */}
      <Box sx={{ maxHeight: "50vh", overflowY: "auto", border: "1px solid #ccc", borderRadius: "8px", padding: "10px", width: "80%", position: "relative", marginTop: "20px" }}>
        <List variant="default" sx={{ minWidth: 240, borderRadius: "sm" }}>
          {notes.length > 0 ? (
            notes.map(({ id, title, description }) => (
              <React.Fragment key={id}>
                <ListItem
                  sx={{ display: "flex", alignItems: "center", gap: 2, transition: "background 0.2s ease", "&:hover": { backgroundColor: "#f9f9f9" } }}
                  onMouseEnter={() => setHoveredItem(id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Title & Description */}
                  {editingItem?.id === id ? (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
                      <input
                        type="text"
                        value={editingItem.title}
                        onChange={(e) => setEditingItem((prev) => ({ ...prev, title: e.target.value }))}
                        style={{ padding: "5px", border: "1px solid #ccc", borderRadius: "5px", width: "100%" }}
                      />
                      <Textarea
                        minRows={2}
                        value={editingItem.description}
                        onChange={(e) => setEditingItem((prev) => ({ ...prev, description: e.target.value }))}
                        sx={{ borderRadius: "5px", width: "100%" }}
                      />
                      <Button size="sm" color="success" onClick={() => handleSaveEdit(id)}>
                        Save
                      </Button>
                    </Box>
                  ) : (
                    <>
                      <Typography level="title-md" sx={{
                                                whiteSpace: "nowrap",
                                                overflowY: "auto",
                                                maxWidth: "150px",
                                                fontWeight: "bold",
                                            }}>
                        {title}
                      </Typography>
                      <Divider orientation="vertical" />
                      <Typography level="body-md" sx={{ maxHeight: "50px", overflowY: "auto", flex: 1 }}>
                        {description}
                      </Typography>
                    </>
                  )}

                  {/* Hoverable Buttons */}
                  {hoveredItem === id && !editingItem && (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton size="small" onClick={() => handleEditClick(id, title, description)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </ListItem>
                <ListDivider />
              </React.Fragment>
            ))
          ) : (
            <Typography sx={{ textAlign: "center", color: "gray" }}>No notes available</Typography>
          )}
        </List>
      </Box>
    </Box>
  );
};

export default Notes;
