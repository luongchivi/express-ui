import React, {useCallback, useEffect, useState} from 'react';
import {createSearchParams, useNavigate, useParams, useSearchParams} from "react-router-dom";
import {Breadcrumb, InputSelect, Pagination, Product, SearchItem} from "../../components";
import {apiGetProducts} from "../../apis";
import Masonry from 'react-masonry-css'
import {sortBy} from "../../utils/containts";

const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
};

const Products = () => {
    const [products, setProducts] = useState([]);
    const [activeClick, setActiveClick] = useState(null);
    const {category} = useParams();
    const [params] = useSearchParams();
    const [sort, setSort] = useState('');
    const [totalItemsFiltered, setTotalItemsFiltered] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate();

    const fetchProducts = async (queries) => {
        const response = await apiGetProducts(queries);
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
    }

    const changeActiveFilter = useCallback((name) => {
        if (activeClick === name) {
            setActiveClick(null);
        } else {
            setActiveClick(name);
        }
    }, [activeClick])

    const changeValueSort = useCallback((value) => {
        setSort(value);
        navigate({
            pathname: `/${category}`,
            search: createSearchParams({...value.value, categoryName: category}).toString()
        })
    }, [sort])

    useEffect(() => {
        let param = []
        for (let i of params.entries()) {
            param.push(i);
        }
        let queries = Object.fromEntries(params.entries());
        fetchProducts({...queries, categoryName: category}).then();
        window.scrollTo(0, 0);
    }, [params])

    return (
        <div className="w-full">
            <div className="h-[81px] flex justify-center items-center bg-gray-100">
                <div className="w-main">
                    <h3 className="font-semibold uppercase">{category}</h3>
                    <Breadcrumb category={category || 'category'}/>
                </div>
            </div>
            <div className="w-main border p-4 flex justify-between m-auto my-8">
                <div className="w-4/5 flex-auto flex flex-col gap-3">
                    <span className="font-semibold text-sm">Filter By</span>
                    <div className="flex items-center gap-4">
                        <SearchItem
                            name='price'
                            activeClick={activeClick}
                            changeActiveFilter={changeActiveFilter}
                            type='input'
                        />
                        <SearchItem
                            name='rating'
                            activeClick={activeClick}
                            changeActiveFilter={changeActiveFilter}
                            type='checkbox'
                        />
                    </div>
                </div>
                <div className="w-1/5 flex flex-col gap-3">
                    <span className="font-semibold text-sm">Sort By</span>
                    <div className="w-full">
                        <InputSelect value={sort} options={sortBy} changeValue={changeValueSort}/>
                    </div>
                </div>
            </div>
            <div className="w-main m-auto">
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="flex flex-wrap mx-[-10px]"
                    columnClassName="my-masonry-grid_column">
                    {products?.map((el, index) => (
                        <Product
                            key={index}
                            productData={el}
                            normal={true}
                        />
                    ))}
                </Masonry>
            </div>
            <div className="w-main m-auto py-4">
                <div className="">
                    <Pagination
                        totalItemsFiltered={totalItemsFiltered}
                        currentPage={currentPage}
                        pageSize={pageSize}
                    />
                </div>
            </div>
        </div>
    )
}

export default Products
