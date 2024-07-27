import axios from "../axios";

export const apiGetCategories = (params) => axios({
    url: "/api/v1/categories",
    method: "GET",
    params
});
