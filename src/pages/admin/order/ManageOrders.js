import React, {useCallback, useEffect, useState} from 'react';
import {apiGetAllListOrdersAdmin, apiUpdateOrderStatusAdmin} from "apis";
import moment from "moment/moment";
import {Pagination} from "components";
import {createSearchParams, useNavigate} from "react-router-dom";
import icons from "utils/icons";
import {useDispatch} from "react-redux";
import {formatMoney} from "../../../utils/helpers";

const {IoSearchOutline} = icons;

const orderStatusColors = {
    'Cancelled': 'bg-red-100 text-red-800',
    'Processing': 'bg-yellow-100 text-yellow-800',
    'Paid': 'bg-blue-100 text-blue-800',
    'Shipping': 'bg-purple-100 text-purple-800',
    'Completed': 'bg-green-100 text-green-800',
};

const orderStatus = Object.freeze({
    CANCELLED: 'Cancelled',
    PROCESSING: 'Processing',
    PAID: 'Paid',
    SHIPPING: 'Shipping',
    COMPLETED: 'Completed',
});

const ManageOrders = () => {
    const dispatch = useDispatch();
    const [orders, setOrders] = useState([]);
    const [queries, setQueries] = useState({page: 1});
    const [searchTerm, setSearchTerm] = useState('');
    const [totalItemsFiltered, setTotalItemsFiltered] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [editingOrderId, setEditingOrderId] = useState(null);
    const [editingOrderStatus, setEditingOrderStatus] = useState('');
    const navigate = useNavigate();

    const fetchOrders = async (params) => {
        const response = await apiGetAllListOrdersAdmin(params);
        if (response?.results?.statusCode === 200) {
            const {
                orders,
                totalItemsFiltered: totalItemsFilteredData,
                currentPage: currentPageData,
                pageSize: pageSizeData,
            } = response?.results;
            setOrders(orders);
            setCurrentPage(currentPageData);
            setTotalItemsFiltered(totalItemsFilteredData);
            setPageSize(pageSizeData);
        }
    };

    useEffect(() => {
        fetchOrders(queries).then();
        navigate({
            pathname: '/admin/manage-orders',
            search: createSearchParams(queries).toString()
        });
    }, [queries, navigate]);

    const saveQueriesInFilter = useCallback((value, keysToRemove = []) => {
        setQueries(prev => {
            const updatedFilter = {...prev, ...value};
            keysToRemove.forEach(key => {
                delete updatedFilter[key];
            });
            return updatedFilter;
        });
    }, []);

    const handleSearch = () => {
        if (searchTerm) {
            saveQueriesInFilter({id: searchTerm, page: 1}, []);
        } else {
            saveQueriesInFilter({page: 1}, ['id']);
        }
    };

    const handleEdit = (orderId, orderStatus) => {
        setEditingOrderId(orderId);
        setEditingOrderStatus(orderStatus);
    };

    const handleSave = async (orderId) => {
        console.log(editingOrderStatus)
        await apiUpdateOrderStatusAdmin(orderId, {orderStatus: editingOrderStatus});
        setEditingOrderId(null);
        fetchOrders(queries);  // Refresh the order list
    };

    return (
        <div className="p-4 m-auto flex flex-col">
            <h1 className="text-3xl font-bold py-4">Manage Orders</h1>
            <div className="w-[500px] flex items-center py-4">
                <input
                    className="w-full p-4 pr-0 rounded-l-xl bg-[#f04646] outline-none text-gray-100 placeholder:text-sm placeholder:text-gray-200 placeholder:italic placeholder:opacity-50"
                    type="text"
                    placeholder="Search orderId"
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
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Full
                            name
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Payment
                            Type
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Order
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Total
                            Amount
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Shipping
                            Order Id
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Expected
                            Delivery Time
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">ShippingFee</th>
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
                    {orders?.map(order => (
                        <tr key={order.id} className="hover:bg-gray-100">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order?.user?.lastName} {order?.user?.firstName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order?.paymentType}
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${orderStatusColors[order?.orderStatus]}`}>
                                {editingOrderId === order.id ? (
                                    <select
                                        value={editingOrderStatus}
                                        onChange={(e) => setEditingOrderStatus(e.target.value)}
                                        className="p-2 bg-white border border-gray-300 rounded"
                                    >
                                        {Object.values(orderStatus).map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                ) : (
                                    order?.orderStatus
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatMoney(order?.totalAmount)} VND
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order?.shippingOrderId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {moment(order?.expectedDeliveryTime).format('DD/MM/YYYY HH:mm')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatMoney(order?.shippingFee)} VND
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {moment(order?.createdAt).format('DD/MM/YYYY HH:mm')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {moment(order?.updatedAt).format('DD/MM/YYYY HH:mm')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {editingOrderId === order?.id ? (
                                    <>
                                        <button
                                            className="text-green-600 hover:text-green-900 mr-4"
                                            onClick={() => handleSave(order.id)}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-900"
                                            onClick={() => setEditingOrderId(null)}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className="text-blue-600 hover:text-blue-900"
                                        onClick={() => handleEdit(order.id, order.orderStatus)}
                                    >
                                        Edit
                                    </button>
                                )}
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

export default ManageOrders;

