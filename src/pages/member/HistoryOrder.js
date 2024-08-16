import React, {memo, useCallback, useEffect, useState} from 'react';
import moment from "moment/moment";
import { formatMoney } from "utils/helpers";
import { apiGetAllListOrdersUser } from "apis";
import { createSearchParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import icons from "utils/icons";
import path from "utils/path";
import { Pagination } from "components";
const { MdArrowRightAlt } = icons;


const HistoryOrder = () => {
    const [orders, setOrders] = useState([]);
    const [params] = useSearchParams();
    const [totalItemsFiltered, setTotalItemsFiltered] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const navigate = useNavigate();
    const [queriesFilter, setQueriesFilter] = useState({});

    const fetchOrders = async (filter) => {
        try {
            const response = await apiGetAllListOrdersUser(filter);
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
        } catch (error) {
            console.log(error);
        }
    };

    const saveQueriesInFilter = useCallback((value, keysToRemove = []) => {
        setQueriesFilter((prev) => {
            const updatedFilter = { ...prev, ...value };
            keysToRemove.forEach((key) => {
                delete updatedFilter[key];
            });
            return updatedFilter;
        });
    }, []);

    useEffect(() => {
        const newQueriesFilter = Object.fromEntries([...params.entries()]);
        setQueriesFilter((prev) => ({ ...prev, ...newQueriesFilter }));
    }, [params]);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchOrders(queriesFilter);
        navigate({
            pathname: '/member/history-order',
            search: createSearchParams(queriesFilter).toString()
        });
    }, [queriesFilter, navigate]);

    return (
        <div className="w-[800px] flex flex-col border border-gray-200 p-6 rounded-md">
            <div className="mb-4 border-b border-main gap-4">
                <h1 className="text-3xl font-bold mb-2">History Orders Review</h1>
            </div>
            <ul>
                {orders?.map((order) => (
                    <li
                        key={order.id}
                        className="flex justify-between items-center p-4 border-b border-gray-200 hover:bg-gray-100"
                    >
                        <div className="flex flex-col gap-4 w-full">
                            <div className="flex gap-4">
                                <label className="font-bold">Payment Type:</label>
                                <span>{order?.paymentType}</span>
                            </div>
                            <div className="flex gap-4">
                                <label className="font-bold">Order status:</label>
                                <span>{order?.orderStatus}</span>
                            </div>
                            <div className="flex gap-4">
                                <label className="font-bold">Expected Delivery Time:</label>
                                <span>{moment(order?.expectedDeliveryTime).format('DD/MM/YYYY HH:mm')}</span>
                            </div>
                            <div className="flex gap-4">
                                <label className="font-bold">Created At:</label>
                                <span>{moment(order?.createdAt).format('DD/MM/YYYY HH:mm')}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex gap-4">
                                    <label className="font-bold">Total Amount:</label>
                                    <span>{formatMoney(order?.totalAmount)} VND</span>
                                </div>
                                <Link
                                    className="flex items-center text-main text-[14px] gap-1 hover:text-black cursor-pointer"
                                    to={`/${path.MEMBER}/${path.SUCCESS}/${order.id}`}
                                >
                                    <span>Review More</span>
                                    <MdArrowRightAlt size={16} />
                                </Link>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="w-full mt-7">
                <Pagination
                    totalItemsFiltered={totalItemsFiltered}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    saveQueriesInFilter={saveQueriesInFilter}
                    text={"orders"}
                />
            </div>
        </div>
    );
};

export default memo(HistoryOrder);
