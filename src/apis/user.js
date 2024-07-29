import axios from "../axios";

export const apiCurrentUser = () => axios({
    url: "/api/v1/users/current-user",
    method: "GET",
});
