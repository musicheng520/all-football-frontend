import { useEffect, useState } from "react";
import { useParams , Link} from "react-router-dom";
import { getTeamDetail } from "../api/teams";

function TeamDetail() {

    const { id } = useParams();

    const [team, setTeam] = useState(null);
    const [squad, setSquad] = useState([]);
    const [fixtures, setFixtures] = useState([]);

    useEffect(() => {

        getTeamDetail(id, 2025)
            .then(res => {

                const data = res.data.data;

                setTeam(data.team);
                setSquad(data.squad);
                setFixtures(data.recentFixtures);

            })
            .catch(err => {
                console.error(err);
            });

    }, [id]);

    if (!team) {
        return <div>Loading...</div>;
    }

    return (
        <div>

            <h1>{team.name}</h1>

            <img src={team.logo} width="100" />

            <p>Country: {team.country}</p>
            <p>Founded: {team.founded}</p>
            <p>Venue: {team.venueName}</p>

            <h2>Squad</h2>

            {squad.map(player => (
                <div key={player.id}>

                    <img src={player.photo} width="30" />

                    <Link to={`/players/${player.id}?season=2025`}>
                        {player.name}
                    </Link>

                    ({player.age})

                </div>
            ))}

            <h2>Recent Matches</h2>

            {fixtures.map(match => (
                <div key={match.id}>
                    Round: {match.round} | Status: {match.status}
                </div>
            ))}

        </div>
    );
}

export default TeamDetail;