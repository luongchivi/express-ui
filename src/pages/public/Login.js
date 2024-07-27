import React, {useState, useCallback} from 'react';
import bg_login_image from '../../assets/bg_login_image.jpg';
import {InputField, Button} from "../../components";
import {apiSignUp, apiLogin} from "../../apis/auth";
import Swal from 'sweetalert2';
import {useNavigate} from "react-router-dom";
import path from '../../utils/path';
import {signUp} from '../../store/user/userSlice';
import {useDispatch} from "react-redux";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [payload, setPayload] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    })

    const [isSignUp, setIsSignUp] = useState(false);
    const resetPayload = () => {
        setPayload({
            firstName: undefined,
            lastName: undefined,
            email: undefined,
            password: undefined,
        })
    }

    const handleSubmit = useCallback(async () => {
        const {firstName, lastName, ...payloadLogin} = payload;
        if (!isSignUp) {
            const response = await apiLogin(payloadLogin);
            if (response?.results?.statusCode === 200) {
                const { accessToken, user } = response?.results;
                await Swal.fire('Login successfully', response?.results?.message, 'success');
                dispatch(signUp({isLogin: true, token: accessToken, userData: user }));
                navigate(`/${path.HOME}`);
            } else {
                await Swal.fire('Oops! something wrong', response?.results?.message, 'error');
            }
        } else {
            const response = await apiSignUp(payload);
            if (response?.results?.statusCode === 201) {
                await Swal.fire('Sign up successfully', response?.results?.message, 'success').then(() => {
                    setIsSignUp(false);
                    resetPayload();
                    navigate(`/${path.VERIFY_EMAIL}`);
                });
            } else {
                await Swal.fire('Oops! something wrong', response?.results?.message, 'error');
            }
        }
    }, [payload, isSignUp])

    return (
        <div className="w-screen h-screen relative">
            <img
                src={bg_login_image}
                alt=""
                className="w-full h-full object-cover"
            />
            <div className="absolute top-0 bottom-0 left-0 right-1/2 items-center justify-center flex">
                <div className="p-8 bg-white rounded-md min-w-[500px] flex flex-col items-center">
                    <h1 className="text-[28px] font-semibold text-main">{isSignUp ? 'SignUp' : 'Login'}</h1>
                    {
                        isSignUp && (
                            <div className="flex items-center gap-2">
                                <InputField
                                    value={payload.firstName}
                                    setValue={setPayload}
                                    nameKey="firstName"
                                />
                                <InputField
                                    value={payload.lastName}
                                    setValue={setPayload}
                                    nameKey="lastName"
                                />
                            </div>)
                    }
                    <InputField
                        value={payload.email}
                        setValue={setPayload}
                        nameKey="email"
                    />
                    <InputField
                        value={payload.password}
                        setValue={setPayload}
                        nameKey="password"
                        type="password"
                    />
                    <Button
                        name={isSignUp ? 'SignUp' : 'Login'}
                        fw
                        handleOnClick={handleSubmit}
                    />
                    <div className="flex items-center justify-between my-2 w-full text-sm">
                        {
                            !isSignUp &&
                            <span
                                className="text-blue-500 hover:underline cursor-pointer"
                                onClick={() => {
                                    navigate(`/${path.FORGOT_PASSWORD}`);
                                }}
                            >Forgot password</span>
                        }
                        {
                            !isSignUp &&
                            <span
                                className="text-blue-500 hover:underline cursor-pointer"
                                onClick={() => setIsSignUp(true)}
                            >Create account</span>
                        }
                        {
                            isSignUp &&
                            <span
                                className="text-blue-500 hover:underline cursor-pointer w-full text-center"
                                onClick={() => setIsSignUp(false)}
                            >Back to Login</span>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
