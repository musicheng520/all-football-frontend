import { Box } from "@mui/material";
import { theme } from "../styles/theme";

const NavPill = ({ active, children, onClick }) => {
    return (
        <Box
            onClick={onClick}
            sx={{
                px: 2,
                py: 0.8,
                borderRadius: "999px",
                background: active
                    ? theme.colors.primary
                    : theme.colors.neutral.grey,
                color: active
                    ? theme.colors.neutral.black
                    : "#666",
                fontWeight: active ? 600 : 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                    background: active
                        ? theme.colors.secondary.main
                        : "#ddd",
                },
            }}
        >
            {children}
        </Box>
    );
};

export default NavPill;