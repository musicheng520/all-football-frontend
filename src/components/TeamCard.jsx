import { Card, CardContent, Avatar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function TeamCard({ team }) {

    return (

        <Card sx={{ textAlign: "center", p: 2 }}>

            <Avatar
                src={team.logo}
                sx={{ width: 70, height: 70, margin: "0 auto" }}
            />

            <Typography
                component={Link}
                to={`/teams/${team.id}?season=2025`}
                sx={{ textDecoration: "none", display: "block", mt: 1 }}
            >
                {team.name}
            </Typography>

        </Card>

    );

}

export default TeamCard;