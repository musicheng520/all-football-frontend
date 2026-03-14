import { Box, Typography } from "@mui/material";

const CommentItem = ({ comment }) => {

    return (
        <Box sx={{ mb: 2, p: 2, border: "1px solid #eee", borderRadius: 2 }}>

            <Typography variant="subtitle2">
                User {comment.userId}
            </Typography>

            <Typography variant="body1" sx={{ mt: 1 }}>
                {comment.content}
            </Typography>

            <Typography variant="caption" color="text.secondary">
                {comment.createdAt}
            </Typography>

        </Box>
    );
};

export default CommentItem;