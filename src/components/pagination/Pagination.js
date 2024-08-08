import React, {memo} from 'react';
import usePagination from "hooks/usePagination";
import {PaginateItem} from "components";

const Pagination = ({totalItemsFiltered, currentPage, pageSize, saveQueriesInFilter, text='products'}) => {
    const pagination = usePagination(totalItemsFiltered, currentPage);

    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(currentPage * pageSize, totalItemsFiltered);
    return (
        <div className="flex items-center justify-between gap-2">
            <span className="flex text-sm italic">
                {`Show ${text} ${!Number(startIndex) ? 0 : startIndex} - ${endIndex} of ${totalItemsFiltered}`}
            </span>
            <div className="flex items-center gap-2">
                {pagination?.map((el, i) => (
                    <PaginateItem
                        key={i}
                        saveQueriesInFilter={saveQueriesInFilter}
                    >
                        {el}
                    </PaginateItem>
                ))}
            </div>
        </div>
    )
}

export default memo(Pagination)

