import { Box, Typography, Avatar } from "@mui/material";

const DEFAULT_AVATAR = "https://via.placeholder.com/40";

const CommentItem = ({ comment }) => {

    if (!comment) return null;

    return (
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>

            <Avatar src={comment.avatar || DEFAULT_AVATAR} />

            <Box>
                <Typography fontWeight={600}>
                    {comment.username}
                </Typography>

                <Typography>
                    {comment.content}
                </Typography>

                <Typography fontSize={12} color="gray">
                    {comment.createdAt?.join
                        ? `${comment.createdAt[0]}-${comment.createdAt[1]}-${comment.createdAt[2]}`
                        : ""}
                </Typography>
            </Box>

        </Box>
    );
};

export default CommentItem;