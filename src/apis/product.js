import axios from "../axios";

export const apiGetProducts = (params) => axios({
    url: "/api/v1/products",
    method: "GET",
    params,
});

export const apiGetProductDetails = (pid) => axios({
    url: `/api/v1/products/${pid}`,
    method: "GET",
});
