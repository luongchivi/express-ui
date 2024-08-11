import axios from "../axios";

export const apiGetWard = (params) => axios({
    url: `/api/v1/wards`,
    method: "GET",
    params,
});
