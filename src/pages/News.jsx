import { Container, Grid, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { getNewsList } from "../api/news";
import NewsCard from "../components/cards/NewsCard";
import { Link } from "react-router-dom";
import { formatTime } from "../utils/format";

const DEFAULT_IMG = "https://via.placeholder.com/800x400?text=No+Image";

function News() {

    const [newsList, setNewsList] = useState([]);

    useEffect(() => {
        getNewsList().then(res => {
            setNewsList(res.data.data || []);
        });
    }, []);

    if (!newsList.length) return null;

    const top = newsList[0];
    const rest = newsList.slice(1);

    return (
        <Container sx={{ mt: 4 }}>

            {/* HEADLINE */}
            {top && (
                <Link to={`/news/${top.id}`} style={{ textDecoration: "none" }}>
                    <Box sx={{ mb: 4, borderRadius: 3, overflow: "hidden", position: "relative", height: 320 }}>
                        <img
                            src={top.coverImage || DEFAULT_IMG}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />

                        <Box sx={{ position: "absolute", bottom: 0, width: "100%", p: 3, background: "linear-gradient(transparent, rgba(0,0,0,0.8))" }}>
                            <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700 }}>
                                {top.title}
                            </Typography>

                            <Typography sx={{ color: "#ddd", fontSize: 12 }}>
                                {formatTime(top.publishedAt)}
                            </Typography>
                        </Box>
                    </Box>
                </Link>
            )}

            {/* GRID */}
            <Grid container spacing={3}>
                {rest.map((news) => (
                    <Grid item xs={12} sm={6} md={4} key={news.id}>
                        <NewsCard item={news} />
                    </Grid>
                ))}
            </Grid>

        </Container>
    );
}

export default News;