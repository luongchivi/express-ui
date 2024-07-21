import axios from "../axios";

export const apiGetProducts = (params) => axios({
    url: "/api/v1/products",
    method: "GET",
    params,
});
