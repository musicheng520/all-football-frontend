import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Box } from "@mui/material";
import { getNewsDetail } from "../api/news";

import CommentList from "../components/comments/CommentList";
import CommentForm from "../components/comments/CommentForm";

const NewsDetail = () => {

    const { id } = useParams();

    const [news, setNews] = useState(null);
    const [comments, setComments] = useState([]);

    useEffect(() => {

        const fetchNews = async () => {
            const res = await getNewsDetail(id);
            const data = res.data.data;

            setNews(data);
            setComments(data.comments || []);
        };

        fetchNews();

    }, [id]);

    if (!news) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>

            <Typography variant="h4" gutterBottom>
                {news.title}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {news.authorName} · {news.publishedAt}
            </Typography>

            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                {news.content}
            </Typography>

            <CommentForm newsId={id} />

            <CommentList comments={comments} />

        </Container>
    );
};

export default NewsDetail;