import React, {memo} from 'react';


const InputSelect = ({value, changeValue, options}) => {
    return (
        <select
            className="form-select text-gray-500 text-sm"
            value={value.title}
            onChange={e => changeValue(options.find(opt => opt.title === e.target.value))}
        >
            {options?.map((el, index) => (
                <option className="text-gray-500" key={index} value={el.title}>{el.title}</option>
            ))}
        </select>
    )
}

export default memo(InputSelect)
