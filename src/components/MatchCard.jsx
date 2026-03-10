function MatchCard({ match }) {

    const time = match.matchTime?.join("-");

    return (
        <div style={{
            border: "1px solid #ddd",
            padding: "12px",
            marginBottom: "12px",
            borderRadius: "6px"
        }}>

            <div style={{fontWeight: "bold"}}>
                Team {match.homeTeamId} vs Team {match.awayTeamId}
            </div>

            <div>
                Score: {match.homeScore ?? "-"} : {match.awayScore ?? "-"}
            </div>

            <div>
                Status: {match.status}
            </div>

            <div>
                Time: {time}
            </div>

        </div>
    );

}

export default MatchCard;