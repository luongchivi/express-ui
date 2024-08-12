import React, {memo} from 'react';

const SelectQuantity = ({quantity, handleQuantity, handleChangeQuantity}) => {
    const handleInputChange = (e) => {
        const newQuantity = Number(e.target.value);
        if (newQuantity >= 1 && newQuantity <= 100) {
            handleQuantity(newQuantity);
        }
    };

    const handleButtonClick = (type) => {
        let newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
        newQuantity = Math.max(1, Math.min(newQuantity, 100));
        handleChangeQuantity(type, newQuantity);
    };

    return (
        <div className="flex items-center">
            <span
                onClick={() => handleButtonClick('minus')}
                className="p-2 border-r border-black cursor-pointer">-</span>
            <input
                className="py-2 outline-none w-[50px] text-center"
                type="text"
                value={quantity}
                onChange={handleInputChange}
            />
            <span
                onClick={() => handleButtonClick('plus')}
                className="p-2 border-l border-black cursor-pointer">+</span>
        </div>
    );
};

export default memo(SelectQuantity);
