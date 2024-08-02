import React, {memo, useEffect, useState} from 'react';
import {useSearchParams } from "react-router-dom";
import clsx from "clsx";

const PaginateItem = ({ children, saveQueriesInFilter  }) => {
    const [params] = useSearchParams();
    const [activePage, setActivePage] = useState(Number(params.get("page")) || 1);

    useEffect(() => {
        setActivePage(Number(params.get("page")) || 1);
    }, [params]);

    const handleClickNumberPagination = () => {
        let param = [];
        for (let i of params.entries()) {
            param.push(i);
        }
        const queries = {};
        for (let i of param) {
            queries[i[0]] = i[1];
        }
        if (Number(children)) {
            queries.page = children;
        }
        setActivePage(children);
        saveQueriesInFilter({ page: children });
    }

    const defaultClass = "min-h-[56px] min-w-[52px] flex items-center justify-center p-4 rounded-md cursor-pointer";
    const inactiveClass = "hover:bg-main hover:text-white bg-gray-100";
    const activeClass = "bg-main text-white";

    return (
        <button
            onClick={handleClickNumberPagination}
            type='button'
            disabled={!Number(children)}
            className={clsx(defaultClass, {
                [inactiveClass]: activePage !== Number(children),
                [activeClass]: activePage === Number(children)
            })}
        >
            {children}
        </button>
    )
}

export default memo(PaginateItem);
