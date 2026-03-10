import { useEffect, useState } from "react";
import { getFixtures } from "../api/fixtures";
import MatchCard from "../components/MatchCard";

function Matches() {

    const [matches, setMatches] = useState([]);

    useEffect(() => {
        getFixtures()
            .then((res) => {
                console.log(res.data);
                setMatches(res.data.data.records);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    return (
        <div>
            <h1>Matches</h1>

            {matches.map((match) => (
                <MatchCard key={match.id} match={match} />
            ))}

        </div>
    );
}

export default Matches;