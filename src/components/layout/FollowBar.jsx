// components/layout/FollowBar.jsx

import { Box, Avatar, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function FollowBar({
                                      teams,
                                      currentTeam,
                                      onSelect,
                                      onAdd
                                  }) {
    return (
        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>

            {teams.map(t => (
                <Avatar
                    key={t.id}
                    src={t.logo}
                    onClick={() => onSelect(t)}
                    sx={{
                        width: 52,
                        height: 52,
                        cursor: "pointer",
                        border:
                            currentTeam?.id === t.id
                                ? "3px solid #BFF332"
                                : "2px solid transparent",
                        "&:hover": { transform: "scale(1.1)" }
                    }}
                />
            ))}

            {/* 🔥 ADD BUTTON */}
            <IconButton
                onClick={onAdd}
                sx={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: "#F3F3F3"
                }}
            >
                <AddIcon />
            </IconButton>

        </Box>
    );
}