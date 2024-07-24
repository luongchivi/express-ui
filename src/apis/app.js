import axios from "../axios";

export const apiGetCategories = () => axios({
    url: "/api/v1/categories",
    method: "GET",
});

export const apiGetProducts = (params) => axios({
    url: "/api/v1/products",
    method: "GET",
    params
});
