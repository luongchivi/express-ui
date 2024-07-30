import axios from "../axios";

export const apiGetReviewsProduct = (pid, params) => axios({
    url: `/api/v1/reviews/${pid}/product`,
    method: "GET",
    params,
});