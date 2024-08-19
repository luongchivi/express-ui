import React, { useCallback, useEffect, useState } from 'react';
import moment from "moment/moment";
import {ConfirmDelete, Loading, Pagination} from "components";
import {createSearchParams, Link, useNavigate} from "react-router-dom";
import icons from "utils/icons";
import Swal from "sweetalert2";
import {showModal} from "store/app/appSlice";
import {useDispatch} from "react-redux";
import {apiDeleteCategory, apiGetCategories} from "../../../apis";
import defaultImage from "../../../assets/default_image_product.png";

const { IoSearchOutline } = icons;

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [queries, setQueries] = useState({ page: 1 });
    const [searchTerm, setSearchTerm] = useState('');
    const [totalItemsFiltered, setTotalItemsFiltered] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchProducts = async (params) => {
        const response = await apiGetCategories(params);
        if (response?.results?.statusCode === 200) {
            const {
                categories,
                totalItemsFiltered: totalItemsFilteredData,
                currentPage: currentPageData,
                pageSize: pageSizeData,
            } = response?.results;
            setCategories(categories);
            setCurrentPage(currentPageData);
            setTotalItemsFiltered(totalItemsFilteredData);
            setPageSize(pageSizeData);
        }
    };

    const handleEdit = (categoryId) => {
        navigate({ pathname: `/admin/update-category/${categoryId}` });
    };

    const handleDelete = async (categoryId) => {
        if (categoryId) {
            dispatch(showModal({isShowModal: true, modalChildren: <Loading />}))
            const response = await apiDeleteCategory(categoryId);
            dispatch(showModal({isShowModal: false, modalChildren: null}))
            if (response?.results?.statusCode === 200) {
                await Swal.fire('Delete category successfully.', response?.results?.message, 'success');
                setQueries(prev => ({...prev}));
            } else {
                await Swal.fire('Oops! something wrong.', response?.results?.message, 'error');
            }
        }
    };

    useEffect(() => {
        fetchProducts(queries).then();
        navigate({
            pathname: '/admin/manage-categories',
            search: createSearchParams(queries).toString()
        });
    }, [queries, navigate]);

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
            saveQueriesInFilter({ companyName: searchTerm, page: 1 }, []);
        } else {
            saveQueriesInFilter({ page: 1 }, ['companyName']);
        }
    };

    return (
        <div className="p-4 m-auto flex flex-col">
            <h1 className="text-3xl font-bold py-4">Manage Categories</h1>
            <div className="w-[500px] flex items-center py-4">
                <input
                    className="w-full p-4 pr-0 rounded-l-xl bg-[#f04646] outline-none text-gray-100 placeholder:text-sm placeholder:text-gray-200 placeholder:italic placeholder:opacity-50"
                    type="text"
                    placeholder="Search category name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div
                    className="h-[56px] w-[56px] bg-black rounded-r-xl flex items-center justify-center text-white cursor-pointer"
                    onClick={handleSearch}
                >
                    <IoSearchOutline size={18}/>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border rounded-md">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">No</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Icon Image</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">thumb Image</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">suppliers</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Created At</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Updated At</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map(category => (
                        <tr key={category.id} className="hover:bg-gray-100">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {category?.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {category?.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {category?.description || 'None'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <img src={category?.iconImageUrl || defaultImage} alt={category?.name}
                                     className="h-16 w-16 object-cover border border-gray-300 p-1"/>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <img src={category?.thumbImageUrl || defaultImage} alt={category?.name}
                                     className="h-16 w-16 object-cover border border-gray-300 p-1"/>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {category?.suppliers && category?.suppliers?.length > 0 ? (
                                    <div>
                                        {category?.suppliers?.map(supplier => supplier.companyName).join(', ')}
                                    </div>
                                ) : (
                                    <p>No suppliers available</p>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {moment(category?.createdAt).format('DD/MM/YYYY HH:mm')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {moment(category?.updatedAt).format('DD/MM/YYYY HH:mm')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button
                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleEdit(category.id);
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="text-red-600 hover:text-red-900"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        console.log(1);
                                        dispatch(showModal({
                                            isShowModal: true,
                                            modalChildren: <ConfirmDelete id={category?.id}
                                                                          handleSubmit={handleDelete}/>
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
                    text={'categories'}
                />
            </div>
        </div>
    );
};

export default ManageCategories;
