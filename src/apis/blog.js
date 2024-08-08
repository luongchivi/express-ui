import axios from "../axios";

export const apiGetAllBlogs = (params) => axios({
    url: `/api/v1/blogs`,
    method: "GET",
    params,
});

export const apiCreateBlog = (data) => axios({
    url: `/api/v1/blogs`,
    method: "POST",
    data,
})

export const apiGetBlogDetails = (id) => axios({
    url: `/api/v1/blogs/${id}`,
    method: "GET",
})

export const apiUpdateBlog = (id, data) => axios({
    url: `/api/v1/blogs/${id}`,
    method: "PUT",
    data,
})

export const apiDeleteBlog = (id) => axios({
    url: `/api/v1/blogs/${id}`,
    method: "DELETE",
})