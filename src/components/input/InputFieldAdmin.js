import React, {useState, useEffect} from 'react';

const InputFieldAdmin = ({label, name, register, schema, error, placeholder}) => {
    const [inputError, setInputError] = useState('');

    useEffect(() => {
        if (error) {
            setInputError(error.message);
        } else {
            setInputError('');
        }
    }, [error]);

    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
            <input
                type="text"
                {...register(name, {
                    validate: value => {
                        const result = schema.validate(value);
                        return result.error ? result.error.details[0].message.replace("value", `${name}`) : true;
                    }
                })}
                placeholder={placeholder}
                className={`shadow appearance-none border ${inputError ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            />
            {inputError && <span className="text-red-500 text-xs italic">{inputError}</span>}
        </div>
    );
};

export default InputFieldAdmin;
