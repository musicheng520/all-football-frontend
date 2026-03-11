import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getPlayerDetail } from "../api/players";

function PlayerDetail() {

    const { id } = useParams();
    const [searchParams] = useSearchParams();

    const season = searchParams.get("season") || 2025;

    const [player, setPlayer] = useState(null);
    const [team, setTeam] = useState(null);
    const [stats, setStats] = useState(null);

    useEffect(() => {

        getPlayerDetail(id, season)
            .then(res => {

                const data = res.data.data;

                setPlayer(data.player);
                setTeam(data.team);

                if (data.statistics && data.statistics.length > 0) {
                    setStats(data.statistics[0]);
                }

            })
            .catch(err => {
                console.error(err);
            });

    }, [id, season]);

    if (!player) {
        return <div>Loading...</div>;
    }

    return (
        <div>

            <h1>{player.name}</h1>

            <img src={player.photo} width="120" />

            <p>Age: {player.age}</p>

            <p>Nationality: {player.nationality}</p>

            {team && (
                <p>Team: {team.name}</p>
            )}

            <h2>Statistics</h2>

            {stats && (
                <div>

                    <p>Appearances: {stats.appearances}</p>

                    <p>Goals: {stats.goals}</p>

                    <p>Assists: {stats.assists}</p>

                    <p>Yellow Cards: {stats.yellowCards}</p>

                    <p>Rating: {stats.rating}</p>

                </div>
            )}

        </div>
    );
}

export default PlayerDetail;