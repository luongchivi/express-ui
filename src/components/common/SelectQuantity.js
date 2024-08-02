import React, {memo} from 'react';

const SelectQuantity = ({quantity, handleQuantity, handleChangeQuantity}) => {
    return (
        <div className="flex items-center">
            <span
                onClick={() => handleChangeQuantity('minus', quantity)}
                className="p-2 border-r border-black cursor-pointer">-</span>
            <input
                className="py-2 outline-none w-[50px] text-center"
                type="text"
                value={quantity}
                onChange={e=> handleQuantity(e.target.value)}
            />
            <span
                onClick={() => handleChangeQuantity('plus', quantity)}
                className="p-2 border-l border-black cursor-pointer">+</span>
        </div>
    )
}

export default memo(SelectQuantity)
