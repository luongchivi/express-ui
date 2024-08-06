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

export const apiUpdateProduct = (pid, data) => axios({
    url: `/api/v1/products/${pid}`,
    method: "PUT",
    data,
});

export const apiCreateProduct = (data) => axios({
    url: `/api/v1/products`,
    method: "POST",
    data,
});

export const apiDeleteProduct = (pid) => axios({
    url: `/api/v1/products/${pid}`,
    method: "DELETE",
});
