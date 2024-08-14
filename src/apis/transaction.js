import axios from "../axios";

export const apiSaveTransactionPaypal = (data) => axios({
    url: "/api/v1/transactions/paypal",
    method: "POST",
    data
});
