import React, {memo, useCallback, useEffect, useState} from 'react';
import {apiDeleteBlog, apiDeleteProduct, apiGetAllBlogs, apiGetProducts} from "apis";
import moment from "moment/moment";
import { ConfirmDelete, Pagination } from "components";
import { createSearchParams, Link, useNavigate } from "react-router-dom";
import defaultImage from "assets/default_image_product.png";
import icons from "utils/icons";
import { showModal } from "store/app/appSlice";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

const { IoSearchOutline } = icons;

const ManageBlogs = () => {
    const dispatch = useDispatch();
    const [blogs, setBlogs] = useState([]);
    const [queries, setQueries] = useState({ page: 1 });
    const [searchTerm, setSearchTerm] = useState('');
    const [totalItemsFiltered, setTotalItemsFiltered] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate();

    const fetchProducts = async (params) => {
        const response = await apiGetAllBlogs(params);
        if (response?.results?.statusCode === 200) {
            const {
                blogs,
                totalItemsFiltered: totalItemsFilteredData,
                currentPage: currentPageData,
                pageSize: pageSizeData,
            } = response?.results;
            setBlogs(blogs);
            setCurrentPage(currentPageData);
            setTotalItemsFiltered(totalItemsFilteredData);
            setPageSize(pageSizeData);
        }
    };

    const handleEdit = (blogId) => {
        navigate({ pathname: `/admin/update-blog/${blogId}` });
    };

    const handleDelete = async (blogId) => {
        if (blogId) {
            const response = await apiDeleteBlog(blogId);
            if (response?.results?.statusCode === 200) {
                await Swal.fire('Delete blog successfully.', response?.results?.message, 'success');
                setQueries(prev => ({ ...prev })); // Triggers a re-fetch
            } else {
                await Swal.fire('Oops! something wrong.', response?.results?.message, 'error');
            }
        }
    };

    useEffect(() => {
        fetchProducts(queries).then();
        navigate({
            pathname: '/admin/manage-blogs',
            search: createSearchParams(queries).toString()
        });
    }, [queries]);

    const saveQueriesInFilter = useCallback((value, keysToRemove = []) => {
        setQueries(prev => {
            const updatedFilter = { ...prev, ...value };
            keysToRemove.forEach(key => {
                delete updatedFilter[key];
            });
            return updatedFilter;
        });
    }, []);

    const handleSearch = () => {
        if (searchTerm) {
            saveQueriesInFilter({ title: searchTerm, page: 1 }, []);
        } else {
            saveQueriesInFilter({ page: 1 }, ['title']);
        }
    };

    return (
        <div className="p-4 m-auto flex flex-col">
            <h1 className="text-3xl font-bold py-4">Manage Blogs</h1>
            <div className="w-[500px] flex items-center py-4">
                <div
                    className="h-[56px] w-[56px] bg-black rounded-l-xl flex items-center justify-center text-white cursor-pointer"
                    onClick={handleSearch}
                >
                    <IoSearchOutline size={18}/>
                </div>
                <input
                    className="w-full p-4 pr-0 rounded-r-xl bg-[#f04646] outline-none text-gray-100 placeholder:text-sm placeholder:text-gray-200 placeholder:italic placeholder:opacity-50"
                    type="text"
                    placeholder="Search blog title"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border rounded-md">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">No</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Image Thumb</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Created By</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Created At</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Updated At</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {blogs.map(blog => (
                        <tr key={blog.id} className="hover:bg-gray-100">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {blog.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {blog.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <img src={blog.thumbImageUrl || defaultImage} alt="Image thumb"
                                     className="h-16 w-16 object-cover border border-gray-300 p-1"/>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {`${blog.user.firstName} ${blog.user.lastName}`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {moment(blog.createdAt).format('DD/MM/YYYY HH:mm')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {moment(blog.updatedAt).format('DD/MM/YYYY HH:mm')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button
                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleEdit(blog.id);
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="text-red-600 hover:text-red-900"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        dispatch(showModal({
                                            isShowModal: true,
                                            modalChildren: <ConfirmDelete id={blog?.id} handleSubmit={handleDelete}/>
                                        }))
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end py-4">
                <Pagination
                    totalItemsFiltered={totalItemsFiltered}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    saveQueriesInFilter={saveQueriesInFilter}
                    text={"blogs"}
                />
            </div>
        </div>
    );
};

export default memo(ManageBlogs);
