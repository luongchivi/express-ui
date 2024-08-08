import React, { useCallback, useEffect, useState } from 'react';
import moment from "moment/moment";
import {ConfirmDelete, Pagination} from "components";
import {createSearchParams, useNavigate} from "react-router-dom";
import icons from "utils/icons";
import {apiGetAllSuppliers, apiDeleteSupplier} from "apis/supplier";
import Swal from "sweetalert2";
import {showModal} from "store/app/appSlice";
import {useDispatch} from "react-redux";

const { IoSearchOutline } = icons;

const ManageSuppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [queries, setQueries] = useState({ page: 1 });
    const [searchTerm, setSearchTerm] = useState('');
    const [totalItemsFiltered, setTotalItemsFiltered] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchProducts = async (params) => {
        console.log(params)
        const response = await apiGetAllSuppliers(params);
        if (response?.results?.statusCode === 200) {
            const {
                suppliers,
                totalItemsFiltered: totalItemsFilteredData,
                currentPage: currentPageData,
                pageSize: pageSizeData,
            } = response?.results;
            setSuppliers(suppliers);
            setCurrentPage(currentPageData);
            setTotalItemsFiltered(totalItemsFilteredData);
            setPageSize(pageSizeData);
        }
    };

    const handleEdit = (supplierId) => {
        console.log(supplierId);
        navigate({ pathname: `/admin/update-supplier/${supplierId}` });
    };

    const handleDelete = async (supplierId) => {
        console.log('Delete supplier with ID:', supplierId);
        if (supplierId) {
            const response = await apiDeleteSupplier(supplierId);
            if (response?.results?.statusCode === 200) {
                await Swal.fire('Delete supplier successfully.', response?.results?.message, 'success');
                setQueries(prev => ({...prev})); // Triggers a re-fetch
            } else {
                await Swal.fire('Oops! something wrong.', response?.results?.message, 'error');
            }
        }
    };

    useEffect(() => {
        fetchProducts(queries).then();
        navigate({
            pathname: '/admin/manage-suppliers',
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
            <h1 className="text-3xl font-bold py-4">Manage Suppliers</h1>
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
                    placeholder="Search supplier company name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border rounded-md">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">No</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Company
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Contact
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Address</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">City</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Region</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Country</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Postal
                            Code
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Fax</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Home
                            Page
                        </th>
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
                    {suppliers.map(supplier => (
                        <tr key={supplier.id} className="hover:bg-gray-100">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {supplier?.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {supplier?.companyName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {supplier?.contactName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {supplier?.address}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {supplier?.city}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {supplier?.region}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {supplier?.country}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {supplier?.postalCode}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {supplier?.phone}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {supplier?.fax}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {supplier?.homePage}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {moment(supplier?.createdAt).format('DD/MM/YYYY HH:mm')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {moment(supplier?.updatedAt).format('DD/MM/YYYY HH:mm')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button
                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleEdit(supplier.id);
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
                                            modalChildren: <ConfirmDelete id={supplier?.id} handleSubmit={handleDelete}/>
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
                    text={'suppliers'}
                />
            </div>
        </div>
    );
};

export default ManageSuppliers;
