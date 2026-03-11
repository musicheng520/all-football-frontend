import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFixtureDetail } from "../api/fixtures";

function MatchDetail() {

    const { id } = useParams();

    const [match, setMatch] = useState(null);

    useEffect(() => {

        getFixtureDetail(id)
            .then((res) => {
                setMatch(res.data.data);
            })
            .catch((err) => {
                console.error(err);
            });

    }, [id]);

    if (!match) {
        return <div>Loading...</div>;
    }

    return (
        <div>

            <h1>Match Detail</h1>

            <h2>
                Team {match.homeTeamId} vs Team {match.awayTeamId}
            </h2>

            <p>
                Score: {match.homeScore ?? "-"} : {match.awayScore ?? "-"}
            </p>

            <p>Status: {match.status}</p>

            <p>Venue: {match.venue}</p>

            <p>Referee: {match.referee ?? "Unknown"}</p>

        </div>
    );
}

export default MatchDetail;