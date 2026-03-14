import { Typography } from "@mui/material";
import CommentItem from "./CommentItem";

const CommentList = ({ comments }) => {

    return (
        <div>

            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Comments
            </Typography>

            {comments.length === 0 && (
                <Typography>No comments yet.</Typography>
            )}

            {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
            ))}

        </div>
    );
};

export default CommentList;