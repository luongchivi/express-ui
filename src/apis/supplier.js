import axios from "../axios";

export const apiGetAllSuppliers = (params) => axios({
    url: `/api/v1/suppliers`,
    method: "GET",
    params,
});

export const apiAddSupplier = (data) => axios({
    url: `/api/v1/suppliers`,
    method: "POST",
    data,
})

export const apiGetSupplierDetails = (pid, params) => axios({
    url: `/api/v1/suppliers/${pid}`,
    method: "GET",
    params,
})

export const apiUpdateSupplier = (pid, data) => axios({
    url: `/api/v1/suppliers/${pid}`,
    method: "PUT",
    data,
})

export const apiDeleteSupplier = (pid) => axios({
    url: `/api/v1/suppliers/${pid}`,
    method: "DELETE",
})