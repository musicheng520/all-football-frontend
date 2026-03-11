import request from "./request";

export const getPlayerDetail = (id, season) => {
    return request.get(`/players/${id}`, {
        params: { season }
    });
};

export const getPlayers = (params) => {
    return request.get("/players", { params });
};