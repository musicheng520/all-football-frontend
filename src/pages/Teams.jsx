import { useEffect, useState } from "react";
import { getTeams } from "../api/teams";
import { useNavigate } from "react-router-dom";

function Teams() {

    const [teams, setTeams] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        getTeams({ leagueId: 140, season: 2025 })
            .then(res => {
                setTeams(res.data.data.records);
            })
            .catch(err => {
                console.error(err);
            });

    }, []);

    return (

        <div>

            <h1>Teams</h1>

            {teams.map(team => (

                <div
                    key={team.id}
                    style={{cursor: "pointer", marginBottom: "10px"}}
                    onClick={() => navigate(`/teams/${team.id}`)}
                >

                    <img
                        src={team.logo}
                        width="30"
                        style={{marginRight: "10px"}}
                    />

                    {team.name}

                </div>

            ))}

        </div>

    );
}

export default Teams;