import axios from "../axios";

export const apiGetCategories = () => axios({
    url: "/api/v1/categories",
    method: "GET",
});
