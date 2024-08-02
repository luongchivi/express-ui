import React, {memo, useEffect} from 'react';
import icons from "../utils/icons";
import {ratings} from "../utils/containts";
import {createSearchParams, useNavigate, useParams, useSearchParams} from "react-router-dom";
import {apiGetProducts} from "../apis";
import useDebounce from "../hooks/useDebounce";

const {IoIosArrowDown} = icons;


const SearchItem = ({name, activeClick, changeActiveFilter, type = 'checkbox'}) => {
    const { category } = useParams();
    const navigate = useNavigate();
    const [selected, setSelected] = React.useState([]);
    const [highestPrice, setHighestPrice] = React.useState(0);
    const [price, setPrice] = React.useState([0,0]);

    const handleSelect = (e) => {
        const value = parseInt(e.target.value);
        const alreadySelected = selected.find(el => el === value);
        if (alreadySelected) {
            setSelected(prev => prev.filter(el => el !== value));
        } else {
            setSelected(prev => [...prev, value]);
        }
        // changeActiveFilter(null);
    }

    const fetchHighestPrice = async () => {
        const response = await apiGetProducts({sortBy: 'unitPrice', sortOrder: 'desc', categoryName: category});
        if (response?.results?.statusCode === 200) {
            const {products} = response?.results;
            if (products[0]) {
                const {unitPrice} = products[0];
                setHighestPrice(unitPrice)
            }
        }
    }

    useEffect(() => {
        if (selected.length > 0) {
            navigate({
                pathname: `/${category}`,
                search: createSearchParams({
                    averageRating: selected.join(','),
                    page: 1,
                }).toString(),
            })
        } else {
            navigate({
                pathname: `/${category}`,
                search: createSearchParams({
                    page: 1,
                }).toString(),
            })
        }
    }, [selected])

    useEffect(() => {
        if (type === 'input') {
            fetchHighestPrice().then();
        }
    }, [type])

    const debouncePriceFrom = useDebounce(price[0], 400)
    const debouncePriceTo = useDebounce(price[1], 400)
    useEffect(() => {
        const priceFrom = price[0]
        const priceTo = price[1]
        if (priceFrom >= 0 && priceTo > 0 && priceFrom < priceTo) {
            navigate({
                pathname: `/${category}`,
                search: createSearchParams({
                    unitPrice: `${priceFrom},${priceTo}`,
                    page: 1,
                }).toString(),
            })
        } else {
            navigate({
                pathname: `/${category}`,
                search: createSearchParams({
                    page: 1,
                }).toString(),
            })
        }
    }, [debouncePriceFrom, debouncePriceTo]);

    return (
        <div
            onClick={() => changeActiveFilter(name)}
            className="cursor-pointer relative text-gray-500 gap-6 p-3 text-xs border border-gray-800 flex justify-between items-center"
        >
            <span className="capitalize">{name}</span>
            <IoIosArrowDown />
            {activeClick === name && (
                <div className="absolute z-10 top-[calc(100%+1px)] left-0 w-fit border bg-white min-w-[150px] border-b">
                    {type === "checkbox" && (
                        <div className="p-2">
                            <div className="py-2 items-center flex justify-between gap-2">
                                <span className="whitespace-nowrap">{`${selected.length === 0 ? 'None' : selected.length} selected`}</span>
                                <span
                                    onClick={e => {
                                        e.stopPropagation();
                                        setSelected([]);
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
                                            checked={selected.some(i => i === el)}
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
                                        setPrice([0, 0]);
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
