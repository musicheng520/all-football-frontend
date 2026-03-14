import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { createComment } from "../../api/commentApi";

const CommentForm = ({ newsId }) => {

    const [content, setContent] = useState("");

    const handleSubmit = async () => {

        if (!content.trim()) return;

        await createComment({
            newsId: newsId,
            content: content
        });

        setContent("");
    };

    return (
        <Box sx={{ mt: 4 }}>

            <Typography variant="h6" sx={{ mb: 2 }}>
                Leave a Comment
            </Typography>

            <TextField
                fullWidth
                multiline
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleSubmit}
            >
                Post Comment
            </Button>

        </Box>
    );
};

export default CommentForm;