function MatchCard({ match }) {

    const getStatusColor = (status) => {

        if (status === "LIVE") return "red";
        if (status === "FT") return "gray";

        return "green";
    };

    const time = match.matchTime?.join("-");

    return (
        <div
            style={{
                border: "1px solid #ddd",
                padding: "12px",
                marginBottom: "12px",
                borderRadius: "6px"
            }}
        >

            <div style={{ fontWeight: "bold", marginBottom: "6px" }}>
                Team {match.homeTeamId} vs Team {match.awayTeamId}
            </div>

            <div>
                Score: {match.homeScore ?? "-"} : {match.awayScore ?? "-"}
            </div>

            <div>
                Status:
                <span
                    style={{
                        color: getStatusColor(match.status),
                        marginLeft: "6px"
                    }}
                >
          {match.status}
        </span>
            </div>

            <div>
                Time: {time}
            </div>

        </div>
    );
}

export default MatchCard;