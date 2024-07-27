// import React from 'react';
//
//
// const InputField = ({value, setValue, nameKey, type, invalidFields, setInvalidFields}) => {
//     return (
//         <div className="w-full flex flex-col relative mb-2">
//             {
//                 value.trim() !== '' &&
//                 <label
//                     className="text-[12px] absolute top-0 left-[12px] block bg-white px-1"
//                     htmlFor={nameKey}>{nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
//                 </label>
//             }
//             <input
//                 className="px-4 py-2 rounded-sm placeholder:text-sm placeholder:italic border w-full mt-2 outline-none"
//                 type={type || "text"}
//                 name=""
//                 id=""
//                 placeholder={nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
//                 onChange={e => setValue(prev => ({...prev, [nameKey]: e.target.value}))}
//             />
//             {
//                 invalidFields?.some(el => el.name === nameKey) &&
//                 <small
//                     className="text-main font-[10px] italic"
//                 >
//                     {invalidFields.find(el => el.name === nameKey)?.message}
//                 </small>
//             }
//         </div>
//     )
// }
//
// export default InputField

import React from 'react';

const InputField = ({value, setValue, nameKey, type, invalidFields, setInvalidFields}) => {
    return (
        <div className="w-full flex flex-col relative mb-2">
            {
                value.trim() !== '' &&
                <label
                    className="text-[12px] absolute top-0 left-[12px] block bg-white px-1"
                    htmlFor={nameKey}>{nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
                </label>
            }
            <input
                className="px-4 py-2 rounded-sm placeholder:text-sm placeholder:italic border w-full mt-2 outline-none"
                type={type || "text"}
                value={value} // Controlled value
                id={nameKey}
                placeholder={nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
                onChange={e => setValue(prev => ({...prev, [nameKey]: e.target.value}))}
            />
            {
                invalidFields?.some(el => el.name === nameKey) &&
                <small className="text-main font-[10px] italic">
                    {invalidFields.find(el => el.name === nameKey)?.message}
                </small>
            }
        </div>
    );
};

export default InputField;

