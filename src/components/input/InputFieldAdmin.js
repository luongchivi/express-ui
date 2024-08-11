import React, { useState, useEffect } from 'react';

const InputFieldAdmin = ({ label, name, register, schema, error, placeholder, type = 'text', selectors, selectorName, defaultValue, onChange, disabled }) => {
    const [inputError, setInputError] = useState('');

    useEffect(() => {
        if (error) {
            setInputError(error.message);
        } else {
            setInputError('');
        }
    }, [error]);

    const renderInputField = () => {
        switch (type) {
            case 'select':
                return (
                    <select
                        {...register(name, {
                            validate: value => {
                                const result = schema.validate(value);
                                return result.error ? result.error.details[0].message.replace("value", `${name}`) : true;
                            }
                        })}
                        className={`shadow appearance-none border ${inputError ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                        onChange={onChange}
                    >
                        <option value={defaultValue}>Select a {selectorName}</option>
                        {selectors?.map(el => (
                            <option key={el.code} value={el.code}>{el.name}</option>
                        ))}
                    </select>
                );
            default:
                return (
                    <input
                        type={type}
                        {...register(name, {
                            validate: value => {
                                const result = schema.validate(value);
                                return result.error ? result.error.details[0].message.replace("value", `${name}`) : true;
                            }
                        })}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={`shadow appearance-none border ${inputError ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    />
                );
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
            {label}
            </label>
            {renderInputField()}
            {inputError && <p className="text-red-500 text-xs italic">{inputError}</p>}
        </div>
    );
};

export default InputFieldAdmin;
