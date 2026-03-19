import { useEffect, useState } from "react";
import { Container, Grid, Typography } from "@mui/material";
import { getNewsList } from "../api/news";
import NewsCard from "../components/cards/NewsCard.jsx";

function News() {

    const [newsList, setNewsList] = useState([]);

    useEffect(() => {

        const fetchNews = async () => {
            const res = await getNewsList();
            setNewsList(res.data.data);
        };

        fetchNews();

    }, []);

    return (
        <Container sx={{ mt: 4 }}>

            <Typography variant="h4" gutterBottom>
                News
            </Typography>

            <Grid container spacing={3}>
                {newsList.map((news) => (
                    <Grid item xs={12} sm={6} md={4} key={news.id}>
                        <NewsCard item={news} />
                    </Grid>
                ))}
            </Grid>

        </Container>
    );
}

export default News;