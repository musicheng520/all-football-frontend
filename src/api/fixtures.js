import request from "./request.js";

export const getFixtures = (params) => {
    return request.get("/fixtures", { params });
};

export const getFixtureDetail = (id) => {
    return request.get(`/fixtures/${id}`);
};