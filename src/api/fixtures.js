import request from "./request.js";

export const getFixtures = (params) => {
    return request.get("/fixtures", { params });
};

export const getFixtureDetail = (id) => {
    return request.get(`/fixtures/${id}`);
};

export const getLiveMatches = () => {
    return request.get("/fixtures/live");
};

export const getRecentMatches = () => {
    return request.get("/fixtures/recent");
};

export const getUpcomingMatches = () => {
    return request.get("/fixtures/upcoming");
};