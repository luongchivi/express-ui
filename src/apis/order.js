import axios from "../axios";

export const apiCheckOutOrder = (data) => axios({
    url: '/api/v1/orders/check-out',
    method: "POST",
    data
});

export const apiCalculateShippingFee = () => axios({
    url: '/api/v1/orders/calculate-shipping-fee',
    method: "GET",
});

export const apiGetOrderDetailsUser = (orderId) => axios({
    url: `/api/v1/orders/${orderId}/user`,
    method: "GET",
});

export const apiUpdateOrderStatus = (orderId) => axios({
    url: `/api/v1/orders/${orderId}/user`,
    method: "PUT",
});

export const apiGetAllListOrders = (params) => axios({
    url: '/api/v1/orders/user',
    method: "GET",
    params,
});

export const apiCancelOrder = (orderId) => axios({
    url: `/api/v1/orders/${orderId}/cancel-order`,
    method: "POST",
});