import React, {useCallback, useEffect, useState} from 'react';
import {useParams, useSearchParams} from "react-router-dom";
import {Breadcrumb, InputSelect, Product, SearchItem} from "../../components";
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
    const [params] = useSearchParams();
    const [sort, setSort] = useState('');

    const fetchProducts = async (queries) => {
        const response = await apiGetProducts(queries);
        if (response?.results?.statusCode === 200) {
            const {products} = response?.results;
            setProducts(products);
        }
    }

    const {category} = useParams();
    useEffect(() => {
        let param = []
        for (let i of params.entries()) {
            param.push(i);
        }
        let queries = Object.fromEntries(params.entries());
        fetchProducts({ ...queries, categoryName: category.replace('-',' ')}).then();
    }, [params])

    const changeActiveFilter = useCallback((name) => {
        if (activeClick === name) {
            setActiveClick(null);
        } else {
            setActiveClick(name);
        }
    }, [activeClick])

    const changeValueSort = useCallback((value) => {
        setSort(value);
        fetchProducts({...value.value, categoryName: category.replace('-',' ')}).then();
    }, [sort])

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
        </div>
    )
}

export default Products
