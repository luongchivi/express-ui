import axios from "../axios";

export const apiGetReviewsProduct = (pid, params) => axios({
    url: `/api/v1/reviews/${pid}/product`,
    method: "GET",
    params,
});

export const apiAddReviewProduct = (pid, data) => axios({
    url: `/api/v1/reviews/${pid}/product`,
    method: "POST",
    data,
})