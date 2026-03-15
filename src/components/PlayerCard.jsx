import { Card, CardContent, Avatar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function PlayerCard({ player }) {

    return (

        <Card sx={{ textAlign: "center", p: 2 }}>

            <Avatar
                src={player.photo}
                sx={{ width: 70, height: 70, margin: "0 auto" }}
            />

            <Typography
                component={Link}
                to={`/players/${player.id}?season=2025`}
                sx={{ textDecoration: "none", display: "block", mt: 1 }}
            >
                {player.name}
            </Typography>

        </Card>

    );

}

export default PlayerCard;