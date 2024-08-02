import React, {memo, useEffect} from 'react';
import icons from "utils/icons";
import {ratings} from "utils/containts";
import {apiGetProducts} from "apis";
import useDebounce from "hooks/useDebounce";

const {IoIosArrowDown} = icons;

const SearchItem = ({name, activeClick, changeActiveFilter, saveQueriesInFilter, categoryName, type = 'checkbox'}) => {
    const [averageRatingSelected, setAverageRatingSelected] = React.useState([]);
    const [highestPrice, setHighestPrice] = React.useState(0);
    const [price, setPrice] = React.useState([0,0]);

    const handleSelect = (e) => {
        const value = parseInt(e.target.value);
        const alreadySelected = averageRatingSelected.find(el => el === value);
        if (alreadySelected) {
            setAverageRatingSelected(prev => prev.filter(el => el !== value));
        } else {
            setAverageRatingSelected(prev => [...prev, value]);
        }
    }

    const fetchHighestPrice = async () => {
        let filterCategoryName = {};
        if (categoryName) {
            filterCategoryName.categoryName = categoryName;
        }
        const response = await apiGetProducts({sortBy: 'unitPrice', sortOrder: 'desc', ...filterCategoryName});
        if (response?.results?.statusCode === 200) {
            const {products} = response?.results;
            if (products[0]) {
                const {unitPrice} = products[0];
                setHighestPrice(unitPrice)
            }
        }
    }

    useEffect(() => {
        if (averageRatingSelected.length > 0) {
            saveQueriesInFilter({
                averageRating: averageRatingSelected.join(','),
            })
        }
    }, [averageRatingSelected, saveQueriesInFilter]);

    useEffect(() => {
        if (type === 'input') {
            fetchHighestPrice().then();
        }
    }, [categoryName]);

    const debouncePriceFrom = useDebounce(price[0], 400)
    const debouncePriceTo = useDebounce(price[1], 400)
    useEffect(() => {
        const priceFrom = price[0]
        const priceTo = price[1]
        if (priceFrom >= 0 && priceTo > 0 && priceFrom < priceTo) {
            saveQueriesInFilter({
                unitPrice: `${priceFrom},${priceTo}`,
            })
        }
    }, [debouncePriceFrom, debouncePriceTo, saveQueriesInFilter]);

    const resetFilter = () => {
        if (type === 'checkbox') {
            setAverageRatingSelected([]);
            saveQueriesInFilter({}, ['averageRating']);
        }
        if (type === 'input') {
            setPrice([0, 0]);
            saveQueriesInFilter({}, ['unitPrice']);
        }
        changeActiveFilter(null);
    };

    return (
        <div
            onClick={() => changeActiveFilter(name)}
            className="cursor-pointer relative text-gray-500 gap-6 p-3 text-sm border border-gray-800 flex justify-between items-center"
        >
            <span className="capitalize">{name}</span>
            <IoIosArrowDown />
            {activeClick === name && (
                <div className="absolute z-10 top-[calc(100%+1px)] left-0 w-fit border bg-white min-w-[150px] border-b">
                    {type === "checkbox" && (
                        <div className="p-2">
                            <div className="py-2 items-center flex justify-between gap-2">
                                <span className="whitespace-nowrap">{`${averageRatingSelected.length === 0 ? 'None' : averageRatingSelected.length} selected`}</span>
                                <span
                                    onClick={e => {
                                        e.stopPropagation();
                                        resetFilter();
                                        changeActiveFilter(null);
                                    }}
                                    className="underline hover:text-main"
                                >
                                    Reset
                                </span>
                            </div>
                            <div onClick={e => e.stopPropagation()} className="flex flex-col gap-2">
                                {ratings.map((el, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <input
                                            type="checkbox"
                                            id={el}
                                            value={el}
                                            onChange={handleSelect}
                                            checked={averageRatingSelected.some(i => i === el)}
                                            className="form-checkbox"
                                        />
                                        <label className="capitalize text-gray-700" htmlFor={el}>{el} Star</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {type === "input" && (
                        <div onClick={e => e.stopPropagation()}>
                            <div className="p-4 items-center flex justify-between gap-8 border-b">
                                <span className="whitespace-nowrap">The highest price is {highestPrice} VND</span>
                                <span
                                    onClick={e => {
                                        e.stopPropagation();
                                        resetFilter();
                                        changeActiveFilter(null);
                                    }}
                                    className="underline hover:text-main"
                                >
                                    Reset
                                </span>
                            </div>
                            <div className="flex items-center gap-2 p-2">
                                <div className="flex items-center gap-2">
                                    <label htmlFor="from">From</label>
                                    <input
                                        className="form-input"
                                        type="number"
                                        id="from"
                                        value={price[0]}
                                        onChange={e => setPrice([+e.target.value, price[1]])}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label htmlFor="to">To</label>
                                    <input
                                        className="form-input"
                                        type="number"
                                        id="to"
                                        value={price[1]}
                                        onChange={e => setPrice([price[0], +e.target.value])}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default memo(SearchItem);
