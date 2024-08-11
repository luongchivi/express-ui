import React, {useCallback, useEffect, useState} from 'react';
import {InputField, Button, Loading} from "components";
import Swal from 'sweetalert2';
import {useNavigate} from "react-router-dom";
import icons from 'utils/icons';
import path from "utils/path";
import {validate} from "utils/helpers";
import {apiSignUp} from "apis/auth";
import {showModal} from "store/app/appSlice";
import {useDispatch} from "react-redux";

const {FaRegRegistered} = icons;

const SignUp = () => {
    const [invalidFields, setInvalidFields] = useState([]);
    const navigate = useNavigate();
    const [payload, setPayload] = React.useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    });
    const dispatch = useDispatch();

    const resetPayload = () => {
        setPayload({
            email: '',
            password: '',
            firstName: '',
            lastName: '',
        })
    };

    useEffect(() => {
        setInvalidFields([]);
    }, [])

    const handleSubmit = useCallback(async () => {
        try {
            const invalids = validate(payload, setInvalidFields);
            if (invalids === 0) {
                dispatch(showModal({isShowModal: true, modalChildren: <Loading />}))
                const response = await apiSignUp(payload);
                dispatch(showModal({isShowModal: false, modalChildren: null}))
                if (response?.results?.statusCode === 201) {
                    await Swal.fire('Sign up successfully', response?.results?.message, 'success').then(() => {
                        navigate(`/${path.VERIFY_EMAIL}`);
                    });
                } else {
                    await Swal.fire('Oops! something wrong', response?.results?.message, 'error');
                    resetPayload();
                }
            }
        } catch (error) {
            await Swal.fire('Error', 'Failed to reset password. Please try again.', 'error');
        }
    }, [payload]);


    return (
        <div className="w-main flex items-center justify-center rounded-sm my-[24px]">
            <div
                className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full border border-1 border-gray-200">
                <FaRegRegistered size={80} className="mx-auto mb-4 text-main"/>
                <h1 className="text-2xl font-semibold mb-2">Register</h1>
                <>
                    <InputField
                        value={payload.firstName}
                        setValue={setPayload}
                        nameKey="firstName"
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                    />
                    <InputField
                        value={payload.lastName}
                        setValue={setPayload}
                        nameKey="lastName"
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                    />
                    <InputField
                        value={payload.email}
                        setValue={setPayload}
                        nameKey="email"
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                    />
                    <InputField
                        value={payload.password}
                        setValue={setPayload}
                        nameKey="password"
                        type={'password'}
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                    />
                </>
                <Button
                    fw
                    handleOnClick={handleSubmit}
                >Submit</Button>
                <span
                    className="text-blue-500 hover:underline cursor-pointer"
                    onClick={() => {
                        navigate(`/${path.LOGIN}`);
                    }}
                >Back to login</span>
            </div>
        </div>
    )
}

export default SignUp

