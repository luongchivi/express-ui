import axios from "../axios";

export const apiGetAllSuppliers = (params) => axios({
    url: `/api/v1/suppliers`,
    method: "GET",
    params,
});

export const apiCreateSupplier = (data) => axios({
    url: `/api/v1/suppliers`,
    method: "POST",
    data,
})

export const apiGetSupplierDetails = (id) => axios({
    url: `/api/v1/suppliers/${id}`,
    method: "GET",
})

export const apiUpdateSupplier = (id, data) => axios({
    url: `/api/v1/suppliers/${id}`,
    method: "PUT",
    data,
})

export const apiDeleteSupplier = (id) => axios({
    url: `/api/v1/suppliers/${id}`,
    method: "DELETE",
})