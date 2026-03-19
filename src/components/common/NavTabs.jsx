import { Box } from "@mui/material";

export default function NavTabs({ tabs, value, onChange }) {
    return (
        <Box sx={{ display: "flex", gap: 1 }}>
            {tabs.map((tab, i) => (
                <Box
                    key={i}
                    onClick={() => onChange(i)}
                    sx={{
                        px: 2.5,
                        py: 1,
                        borderRadius: "999px",
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: 500,
                        background: value === i ? "#111" : "#F3F3F3",
                        color: value === i ? "#fff" : "#555",
                        transition: "0.2s",
                        "&:hover": {
                            background: value === i ? "#111" : "#EAEAEA"
                        }
                    }}
                >
                    {tab}
                </Box>
            ))}
        </Box>
    );
}