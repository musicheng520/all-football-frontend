import apiClient from "./apiClient";

export const getFixtures = () => {
    return apiClient.get("/fixtures");
};