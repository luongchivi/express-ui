import React, {useState, useEffect} from 'react';


const InputFieldAdmin = ({label, name, value, onChange, schema, error, isTextarea = false}) => {
    const [inputError, setInputError] = useState('');

    useEffect(() => {
        if (error) {
            setInputError(error);
        } else {
            setInputError('');
        }
    }, [error]);

    const handleChange = (e) => {
        const {value} = e.target;
        onChange(name, value);

        const result = schema.validate(value);
        if (result.error) {
            setInputError(result.error.details[0].message);
        } else {
            setInputError('');
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
            {
                isTextarea ?
                    <textarea
                        name={name}
                        value={value}
                        onChange={handleChange}
                        className={`shadow appearance-none border ${inputError ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                        rows="10"
                    />
                    :
                    <input
                        type="text"
                        name={name}
                        value={value}
                        onChange={handleChange}
                        className={`shadow appearance-none border ${inputError ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    />
            }

            {inputError && <span className="text-red-500 text-xs italic">{inputError}</span>}
        </div>
    );
};

export default InputFieldAdmin;
