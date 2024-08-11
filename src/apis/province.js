import axios from "../axios";

export const apiGetProvinces = (params) => axios({
    url: `/api/v1/provinces`,
    method: "GET",
    params,
});
