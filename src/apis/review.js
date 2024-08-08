import axios from "../axios";

export const apiCountReviewsStarProduct = (id, params) => axios({
    url: `/api/v1/reviews/${id}/count-review-star-product`,
    method: "GET",
    params,
});

export const apiAddReviewProduct = (id, data) => axios({
    url: `/api/v1/reviews/${id}/product`,
    method: "POST",
    data,
})

export const apiGetAllReviewsProduct = (id, params) => axios({
    url: `/api/v1/reviews/${id}/product`,
    method: "GET",
    params,
})