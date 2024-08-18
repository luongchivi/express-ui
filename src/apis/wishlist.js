import axios from "../axios";

export const apiAddToWishlist = (data) => axios({
    url: '/api/v1/wishlists',
    method: "POST",
    data,
});

export const apiDeleteProductFromWishlist = (data) => axios({
    url: '/api/v1/wishlists',
    method: "DELETE",
    data,
});

export const apiGetAllProductsInWishlistOfUser = (params) => axios({
    url: '/api/v1/wishlists/user',
    method: "GET",
    params,
});
