import request from "./request";

export const getTeams = (params) => {
    return request.get("/teams", { params });
};

export const getTeamDetail = (id, season) => {
    return request.get(`/teams/${id}`, {
        params: { season }
    });
};