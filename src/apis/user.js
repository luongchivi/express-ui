import axios from "../axios";

export const apiCurrentUser = () => axios({
    url: "/api/v1/users/current-user",
    method: "GET",
});

export const apiGetAllUsers = (params) => axios({
    url: "/api/v1/users",
    method: "GET",
    params,
});

export const apiUpdateUser = (id, data) => axios({
    url: `/api/v1/users/${id}`,
    method: "PUT",
    data,
});

export const apiUpdateStatusAdmin = (id, data) => axios({
    url: `/api/v1/users/${id}/admin`,
    method: "PUT",
    data,
});
