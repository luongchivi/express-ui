import React from 'react';
import icons from 'utils/icons';
import {useNavigate, useParams} from "react-router-dom";
import {Button, InputField, Loading} from "../../components";
import {apiResetPassword} from "apis/auth";
import Swal from "sweetalert2";
import path from "utils/path";
import {showModal} from "store/app/appSlice";
import {useDispatch} from "react-redux";

const {RiLockPasswordFill} = icons

const ResetPassword = () => {
    const navigate = useNavigate();
    const {resetToken} = useParams();
    const [payload, setPayload] = React.useState({
        newPassword: '',
    });
    const dispatch = useDispatch();

    const handleSubmit = async () => {
        try {
            dispatch(showModal({isShowModal: true, modalChildren: <Loading />}))
            const response = await apiResetPassword({
                resetToken,
                newPassword: payload.newPassword,
            });
            dispatch(showModal({isShowModal: false, modalChildren: null}))
            if (response?.results?.statusCode === 200) {
                await Swal.fire('Reset Password Successfully', response?.results?.message, 'success');
                navigate(`/${path.LOGIN}`);
            } else {
                await Swal.fire('Oops! something wrong.', response?.results?.message, 'error');
            }
        } catch (error) {
            await Swal.fire('Error', 'Failed to reset password. Please try again.', 'error');
        }
    }

    return (
        <div className="flex items-center justify-center mb-[24px]">
            <div
                className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full border border-1 border-gray-200">
                <RiLockPasswordFill size={80} className="mx-auto mb-4 text-main"/>
                <h1 className="text-2xl font-semibold mb-2 items-center">Change Password</h1>
                <span>Enter a new password below to change.</span>
                <>
                    <InputField
                        value={payload.newPassword}
                        setValue={setPayload}
                        nameKey="newPassword"
                        type={'password'}
                    />
                </>
                <Button
                    fw
                    handleOnClick={handleSubmit}
                >Reset Password</Button>
            </div>
        </div>
    );
}

export default ResetPassword;
