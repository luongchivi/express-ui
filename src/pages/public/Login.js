import React, {useCallback, useEffect, useState} from 'react';
import {InputField, Button} from "../../components";
import {apiLogin} from "../../apis/auth";
import Swal from 'sweetalert2';
import {useNavigate} from "react-router-dom";
import path from '../../utils/path';
import {login} from '../../store/user/userSlice';
import {useDispatch} from "react-redux";
import {validate} from '../../utils/helpers';
import icons from '../../utils/icons';

const {MdLogin} = icons;

const Login = () => {
    const [invalidFields, setInvalidFields] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [payload, setPayload] = React.useState({
        email: '',
        password: '',
    });

    const resetPayload = () => {
        setPayload({
            email: '',
            password: '',
        })
    };

    useEffect(() =>{
        setInvalidFields([]);
    }, [])

    const handleSubmit = useCallback(async () => {
        try {
            const invalids = validate(payload, setInvalidFields);
            if (invalids === 0) {
                const response = await apiLogin(payload);
                if (response?.results?.statusCode === 200) {
                    const { accessToken, user } = response?.results;
                    await Swal.fire('Login successfully', response?.results?.message, 'success');
                    dispatch(login({isLogin: true, accessToken: accessToken, userData: user }));
                    navigate(`/${path.HOME}`);
                } else {
                    await Swal.fire('Oops! something wrong', response?.results?.message, 'error');
                    resetPayload();
                }
            }
        } catch (error) {
            console.log(error);
            await Swal.fire('Error', 'Failed to reset password. Please try again.', 'error');
        }
    }, [payload]);


    return (
        <div className="w-main flex items-center justify-center rounded-sm my-[24px]">
            <div
                className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full border border-1 border-gray-200">
                <MdLogin size={80} className="mx-auto mb-4 text-main"/>
                <h1 className="text-2xl font-semibold mb-2">Login</h1>

                <>
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
                <div className="flex items-center justify-between my-2 w-full text-sm">
                    <span
                        className="text-blue-500 hover:underline cursor-pointer"
                        onClick={() => {navigate(`/${path.FORGOT_PASSWORD}`);}}
                    >Forgot password</span>
                    <span
                        className="text-blue-500 hover:underline cursor-pointer"
                        onClick={() => {navigate(`/${path.SIGN_UP}`);}}
                    >Create account</span>
                </div>
            </div>
        </div>
    )
}

export default Login

