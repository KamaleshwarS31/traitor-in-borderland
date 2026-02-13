"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Box,
    List,
    ListItem,
    ListItemText,
    IconButton,
    CircularProgress,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { adminAPI } from "@/lib/api";

interface Location {
    id: number;
    location_name: string;
    description: string;
}

export default function LocationsManager() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [locationName, setLocationName] = useState("");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchLocations = async () => {
        try {
            const response = await adminAPI.getLocations();
            setLocations(response.data);
        } catch (error) {
            console.error("Error fetching locations:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await adminAPI.createLocation({ location_name: locationName, description });
            setLocationName("");
            setDescription("");
            await fetchLocations();
        } catch (error) {
            console.error("Error creating location:", error);
            alert("Failed to create location");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card
            sx={{
                background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
        >
            <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                    Locations Manager
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
                    <TextField
                        fullWidth
                        label="Location Name"
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                        placeholder="e.g., Library Entrance"
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        rows={2}
                        sx={{ mb: 2 }}
                        placeholder="Optional description"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<Add />}
                        disabled={submitting}
                        fullWidth
                    >
                        {submitting ? "Adding..." : "Add Location"}
                    </Button>
                </Box>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <List>
                        {locations.length === 0 ? (
                            <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                                No locations yet. Add your first location above.
                            </Typography>
                        ) : (
                            locations.map((location) => (
                                <ListItem
                                    key={location.id}
                                    sx={{
                                        mb: 1,
                                        borderRadius: 2,
                                        background: "rgba(255, 255, 255, 0.05)",
                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                    }}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            color="error"
                                            onClick={async () => {
                                                if (confirm("Are you sure you want to delete this location?")) {
                                                    try {
                                                        await adminAPI.deleteLocation(location.id);
                                                        fetchLocations();
                                                    } catch (error) {
                                                        console.error("Delete error", error);
                                                        alert("Failed to delete location: It might be used by a gold bar.");
                                                    }
                                                }
                                            }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary={location.location_name}
                                        secondary={location.description || "No description"}
                                    />
                                </ListItem>
                            ))
                        )}
                    </List>
                )}
            </CardContent>
        </Card>
    );
}
