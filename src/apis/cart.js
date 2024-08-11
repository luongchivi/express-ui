import axios from "../axios";

export const apiGetCartMe = () => axios({
    url: `/api/v1/cart/me`,
    method: "GET",
});

export const apiAddToCart = (data) => axios({
    url: `/api/v1/cart/products`,
    method: "POST",
    data,
});

export const apiUpdateQuantityItem = (pid, data) => axios({
    url: `/api/v1/cart/products/${pid}`,
    method: "PATCH",
    data,
});

export const apiDeleteItem = (pid) => axios({
    url: `/api/v1/cart/products/${pid}`,
    method: "DELETE",
});
