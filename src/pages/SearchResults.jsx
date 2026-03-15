import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { searchPlayers, searchTeams } from "../api/search";

import { Container, Typography, Grid } from "@mui/material";

import PlayerCard from "../components/PlayerCard";
import TeamCard from "../components/TeamCard";

function SearchResults() {

    const [params] = useSearchParams();

    const query = params.get("q");

    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!query) return;

        setLoading(true);

        Promise.all([
            searchPlayers(query),
            searchTeams(query)
        ])
            .then(([playerRes, teamRes]) => {

                setPlayers(playerRes.data.data.records);
                setTeams(teamRes.data.data.records);

            })
            .finally(() => {

                setLoading(false);

            });

    }, [query]);



    if (loading) {

        return (

            <Container>

                <Typography variant="h5">
                    Loading...
                </Typography>

            </Container>

        );

    }



    return (

        <Container>

            <Typography variant="h4" sx={{ mb: 3 }}>
                Search results for "{query}"
            </Typography>


            {/* Teams */}

            <Typography variant="h5" sx={{ mb: 2 }}>
                Teams
            </Typography>

            {teams.length === 0 ? (

                <Typography>No teams found</Typography>

            ) : (

                <Grid container spacing={2} sx={{ mb: 4 }}>

                    {teams.map(team => (

                        <Grid item xs={12} sm={6} md={3} key={team.id}>
                            <TeamCard team={team} />
                        </Grid>

                    ))}

                </Grid>

            )}


            {/* Players */}

            <Typography variant="h5" sx={{ mb: 2 }}>
                Players
            </Typography>

            {players.length === 0 ? (

                <Typography>No players found</Typography>

            ) : (

                <Grid container spacing={2}>

                    {players.map(player => (

                        <Grid item xs={12} sm={6} md={3} key={player.id}>
                            <PlayerCard player={player} />
                        </Grid>

                    ))}

                </Grid>

            )}

        </Container>

    );
}

export default SearchResults;