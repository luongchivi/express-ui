import axios from "../axios";

export const apiCountReviewsStarProduct = (pid, params) => axios({
    url: `/api/v1/reviews/${pid}/count-review-star-product`,
    method: "GET",
    params,
});

export const apiAddReviewProduct = (pid, data) => axios({
    url: `/api/v1/reviews/${pid}/product`,
    method: "POST",
    data,
})

export const apiGetAllReviewsProduct = (pid, params) => axios({
    url: `/api/v1/reviews/${pid}/product`,
    method: "GET",
    params,
})