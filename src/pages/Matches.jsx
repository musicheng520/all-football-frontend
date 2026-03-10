import { useEffect, useState } from "react";
import { getFixtures } from "../api/fixtures";
import MatchCard from "../components/MatchCard";

function Matches() {

    const [matches, setMatches] = useState([]);
    const [leagueId, setLeagueId] = useState(140);
    const [page, setPage] = useState(1);

    useEffect(() => {

        getFixtures({
            leagueId: leagueId,
            season: 2025,
            page: page,
            size: 10
        })
            .then((res) => {
                setMatches(res.data.data.records);
            })
            .catch((err) => {
                console.error(err);
            });

    }, [leagueId, page]);

    return (
        <div>

            <h1>Matches</h1>

            <div style={{marginBottom: "20px"}}>

                <button onClick={() => {
                    setLeagueId(39);
                    setPage(1);
                }}>
                    Premier League
                </button>

                <button onClick={() => {
                    setLeagueId(140);
                    setPage(1);
                }}>
                    La Liga
                </button>

                <button onClick={() => {
                    setLeagueId(78);
                    setPage(1);
                }}>
                    Bundesliga
                </button>

                <button onClick={() => {
                    setLeagueId(135);
                    setPage(1);
                }}>
                    Serie A
                </button>

                <button onClick={() => {
                    setLeagueId(61);
                    setPage(1);
                }}>
                    Ligue 1
                </button>

            </div>

            {/* Match List */}
            {matches.map((match) => (
                <MatchCard key={match.id} match={match}/>
            ))}

            {/* Pagination */}
            <div style={{marginTop: "20px"}}>

                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    Prev
                </button>

                <span style={{margin: "0 10px"}}>
          Page {page}
        </span>

                <button onClick={() => setPage(page + 1)}>
                    Next
                </button>

            </div>

        </div>
    );
}

export default Matches;