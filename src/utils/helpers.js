import icons from "./icons";


export const createSlug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(" ").join("-");
export const formatMoney = number => Number(number?.toFixed(1)).toLocaleString();

export const renderStar = (number, size = 16) => {
    const { FaStar, FaRegStar} = icons;
    const maxStar = 5;
    const emptyStar = maxStar - number;

    const starsArray = [];

    for (let i = 0; i < number; i++) {
        starsArray.push(<FaStar key={i} color="orange" size={size} />);
    }

    for (let i = 0; i < emptyStar; i++) {
        starsArray.push(<FaRegStar key={number + i} color="orange" size={size} />);
    }

    return starsArray;
};
