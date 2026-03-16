import { Select, MenuItem } from "@mui/material";

function SeasonSelector({ season, setSeason }) {

    const seasons = [2025, 2024, 2023, 2022, 2021];

    return (

        <Select
            size="small"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
        >
            {seasons.map((s) => (
                <MenuItem key={s} value={s}>
                    {s}
                </MenuItem>
            ))}
        </Select>

    );

}

export default SeasonSelector;