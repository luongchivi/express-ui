import React from 'react';


const InputField = ({value, setValue, nameKey, type, invalidFields, setInvalidFields}) => {
    return (
        <div className="w-full relative">
            {
                value.trim() !== '' &&
                <label
                    className="text-[12px] absolute top-0 left-[12px] block bg-white px-1"
                    htmlFor={nameKey}>{nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
                </label>
            }
            <input
                className="px-4 py-2 rounded-sm placeholder:text-sm placeholder:italic border w-full my-2 outline-none"
                type={type || "text"}
                name=""
                id=""
                placeholder={nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
                onChange={e => setValue(prev => ({...prev, [nameKey]: e.target.value}))}
            />
        </div>
    )
}

export default InputField
