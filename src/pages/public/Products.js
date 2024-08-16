import React, {useCallback, useEffect, useState} from 'react';
import {createSearchParams, useNavigate, useSearchParams} from "react-router-dom";
import {Breadcrumb, InputSelect, Pagination, Product, SearchItem} from "../../components";
import {apiGetCategories, apiGetProducts} from "../../apis";
import Masonry from 'react-masonry-css';
import {sortBy} from "../../utils/containts";

const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
};

const defaultSort = {
    sortBy: 'id',
    sortOrder: 'desc',
};

const Products = () => {
    const [products, setProducts] = useState([]);
    const [activeClick, setActiveClick] = useState(null);
    const [params] = useSearchParams();
    const [sort, setSort] = useState(defaultSort);
    const [totalItemsFiltered, setTotalItemsFiltered] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [queriesFilter, setQueriesFilter] = useState({
        page: 1,
        ...defaultSort,
    });

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
    };

    const fetchCategories = async () => {
        const response = await apiGetCategories();
        if (response?.results?.statusCode === 200) {
            const {
                categories,
            } = response?.results;
            setCategories(categories);
        }
    };

    const changeActiveFilter = useCallback((name) => {
        setActiveClick(prev => (prev === name ? null : name));
    }, []);

    const changeValueFilterSort = useCallback((value) => {
        const {value: queriesSort} = value;
        const newQueries = {...queriesFilter, ...queriesSort, page: 1};
        setSort(value);
        setQueriesFilter(newQueries);
    }, [queriesFilter]);

    const saveQueriesInFilter = useCallback((value, keysToRemove = []) => {
        setQueriesFilter(prev => {
            const updatedFilter = {...prev, ...value};
            keysToRemove.forEach(key => {
                delete updatedFilter[key];
            });
            return updatedFilter;
        });
    }, []);

    const handleOnChangeCategoryFilter = (e) => {
        const selectedCategory = e.target.value;
        setCategoryName(selectedCategory);
        setQueriesFilter(prev => {
            const updatedFilter = {...prev};
            if (selectedCategory === 'All Categories') {
                delete updatedFilter.categoryName;
            } else {
                updatedFilter.categoryName = selectedCategory;
            }
            updatedFilter.page = 1;
            return updatedFilter;
        })
    };

    useEffect(() => {
        const newQueriesFilter = Object.fromEntries([...params.entries()]);
        setQueriesFilter(prev => ({...prev, ...newQueriesFilter}));
        setCategoryName(newQueriesFilter.categoryName);
    }, [params]);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchProducts(queriesFilter).then();
        fetchCategories().then();
        navigate({
            pathname: '/products',
            search: createSearchParams(queriesFilter).toString()
        });
    }, [queriesFilter, navigate]);

    return (
        <div className="w-full">
            <div className="h-[81px] flex justify-center items-center bg-gray-100">
                <div className="w-main">
                    <h3 className="font-semibold uppercase">{categoryName || 'All Products'}</h3>
                    <Breadcrumb categoryName={categoryName}/>
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
                            saveQueriesInFilter={saveQueriesInFilter}
                            categoryName={categoryName}
                            type='input'
                        />
                        <SearchItem
                            name='rating'
                            activeClick={activeClick}
                            changeActiveFilter={changeActiveFilter}
                            saveQueriesInFilter={saveQueriesInFilter}
                            categoryName={categoryName}
                            type='checkbox'
                        />
                        <select
                            className="form-select text-gray-500 text-sm block min-w-[25px] min-h-[46px] border border-gray-800 cursor-pointer"
                            value={categoryName}
                            onChange={(e) => handleOnChangeCategoryFilter(e)}
                        >
                            <option value={"All Categories"}>All Categories</option>
                            {categories?.map((el, index) => (
                                <option className="text-gray-500" key={index} value={el.name}>
                                    {el.name}
                                </option>
                            ))}
                        </select>

                    </div>
                </div>
                <div className="w-1/5 flex flex-col gap-3">
                    <span className="font-semibold text-sm">Sort By</span>
                    <div className="w-full">
                        <InputSelect
                            value={sort}
                            options={sortBy}
                            changeValue={changeValueFilterSort}
                        />
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
                        saveQueriesInFilter={saveQueriesInFilter}
                    />
                </div>
            </div>
        </div>
    )
}

export default Products
