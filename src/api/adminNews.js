// src/api/adminNews.js
import request from "./request";


export const listAdminNews = (params) => {
    return request.get("/admin/news", { params });
};


export const createAdminNews = (formData) => {
    return request.post("/admin/news/create", formData);
};


export const deleteAdminNews = (id) => {
    return request.delete(`/admin/news/${id}`);
};