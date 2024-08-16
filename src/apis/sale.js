import axios from "../axios";

export const apiGetNumberProductsSalesOfMonth = () => axios({
    url: '/api/v1/sales/monthly',
    method: "GET",
});
