import React, { useCallback, useEffect, useState } from 'react';
import { apiDeleteProduct, apiGetProducts } from "apis";
import moment from "moment/moment";
import {ConfirmDelete, Loading, Pagination} from "components";
import { createSearchParams, Link, useNavigate } from "react-router-dom";
import defaultImage from "assets/default_image_product.png";
import icons from "utils/icons";
import {showLoadingModal, showModal} from "store/app/appSlice";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

const { IoSearchOutline } = icons;

const ManageProducts = () => {
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [queries, setQueries] = useState({ page: 1 });
    const [searchTerm, setSearchTerm] = useState('');
    const [totalItemsFiltered, setTotalItemsFiltered] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate();

    const fetchProducts = async (params) => {
        const response = await apiGetProducts(params);
        if (response?.results?.statusCode === 200) {
            const {
                products,
                totalItemsFiltered: totalItemsFilteredData,
                currentPage: currentPageData,
                pageSize: pageSizeData,
            } = response?.results;
            setProducts(products);
            setCurrentPage(currentPageData);
            setTotalItemsFiltered(totalItemsFilteredData);
            setPageSize(pageSizeData);
        }
    };

    const handleEdit = (productId) => {
        navigate({ pathname: `/admin/update-product/${productId}` });
    };

    const handleDelete = async (productId) => {
        if (productId) {
            const response = await apiDeleteProduct(productId);
            if (response?.results?.statusCode === 200) {
                await Swal.fire('Delete product successfully.', response?.results?.message, 'success');
                setQueries(prev => ({ ...prev }));
            } else {
                await Swal.fire('Oops! something wrong.', response?.results?.message, 'error');
            }
        }
    };

    useEffect(() => {
        fetchProducts(queries).then();
        navigate({
            pathname: '/admin/manage-products',
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
            saveQueriesInFilter({ name: searchTerm, page: 1 }, []);
        } else {
            saveQueriesInFilter({ page: 1 }, ['name']);
        }
    };

    return (
        <div className="p-4 m-auto flex flex-col">
            <h1 className="text-3xl font-bold py-4">Manage Products</h1>
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
                    placeholder="Search product name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border rounded-md">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">No</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Brand</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Created
                            At
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Updated
                            At
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product, index) => (
                        <tr key={product.id} className="hover:bg-gray-100">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <Link
                                    to={`/products/${product?.category?.name?.toLowerCase()}/${product?.id}/${product?.name}`}>
                                    {product.id}
                                </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <Link
                                    to={`/products/${product?.category?.name?.toLowerCase()}/${product?.id}/${product?.name}`}>
                                    {product.name}
                                </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <Link
                                    to={`/products/${product?.category?.name?.toLowerCase()}/${product?.id}/${product?.name}`}>
                                    {product?.category?.name || "None"}
                                </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <Link
                                    to={`/products/${product?.category?.name?.toLowerCase()}/${product?.id}/${product?.name}`}>
                                    {product?.supplier?.companyName || "None"}
                                </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <Link
                                    to={`/products/${product?.category?.name?.toLowerCase()}/${product?.id}/${product?.name}`}>
                                    ${product.unitPrice.toFixed(2)}
                                </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <Link
                                    to={`/products/${product?.category?.name?.toLowerCase()}/${product?.id}/${product?.name}`}>
                                    {product.unitsInStock}
                                </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <Link
                                    to={`/products/${product?.category?.name?.toLowerCase()}/${product?.id}/${product?.name}`}>
                                    {product.averageRating.toFixed(1)}
                                </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <Link
                                    to={`/products/${product?.category?.name?.toLowerCase()}/${product?.id}/${product?.name}`}>
                                    <img src={product.thumbImageUrl || defaultImage} alt={product.name}
                                         className="h-16 w-16 object-cover border border-gray-300 p-1"/>
                                </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <Link
                                    to={`/products/${product?.category?.name?.toLowerCase()}/${product?.id}/${product?.name}`}>
                                    {moment(product.createdAt).format('DD/MM/YYYY HH:mm')}
                                </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <Link
                                    to={`/products/${product?.category?.name?.toLowerCase()}/${product?.id}/${product?.name}`}>
                                    {moment(product.updatedAt).format('DD/MM/YYYY HH:mm')}
                                </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button
                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleEdit(product.id);
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
                                            modalChildren: <ConfirmDelete id={product?.id} handleSubmit={handleDelete}/>
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
                />
            </div>
        </div>
    );
};

export default ManageProducts;
