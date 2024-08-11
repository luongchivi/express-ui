import axios from "../axios";

export const apiGetDistrict = (params) => axios({
    url: `/api/v1/districts`,
    method: "GET",
    params,
});
