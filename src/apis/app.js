import axios from "../axios";

export const apiGetCategories = (params) => axios({
    url: "/api/v1/categories",
    method: "GET",
    params
});

export const apiCreateCategory = (data) => axios({
    url: "/api/v1/categories",
    method: "POST",
    data
});

export const apiDeleteCategory = (categoryId) => axios({
    url: `/api/v1/categories/${categoryId}`,
    method: "DELETE"
});

export const apiGetCategoryDetails = (categoryId) => axios({
    url: `/api/v1/categories/${categoryId}`,
    method: "GET"
});

export const apiUpdateCategory = (categoryId, data) => axios({
    url: `/api/v1/categories/${categoryId}`,
    method: "PUT",
    data
});

export const apiAddSupplierToCategory = (categoryId, data) => axios({
    url: `/api/v1/categories/${categoryId}/supplier`,
    method: "POST",
    data
});

export const apiRemoveSupplierFromCategory = (categoryId, data) => axios({
    url: `/api/v1/categories/${categoryId}/supplier`,
    method: "DELETE",
    data
});
