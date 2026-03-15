import request from "./request";

export const searchPlayers = (name, page = 1) => {
    return request.get("/players/search", {
        params: {
            name,
            page,
            size: 10
        }
    });
};

export const searchTeams = (name, page = 1) => {
    return request.get("/teams/search", {
        params: {
            name,
            page,
            size: 10
        }
    });
};