import React, {useCallback} from 'react';
import {Button, InputField} from "../../components";
import icons from '../../utils/icons';
import {apiForgotPassword} from "../../apis/auth";
import Swal from "sweetalert2";

const {FaLock} = icons;

const ForgotPassword = () => {
    const [payload, setPayload] = React.useState({
        email: '',
    });

    const handleSubmit = useCallback(async () => {
        try {
            const {email} = payload;
            if (email) {
                const response = await apiForgotPassword(payload);
                if (response?.results?.statusCode === 200) {
                    await Swal.fire('Request forgot password successfully.', response?.results?.message, 'success');
                } else {
                    await Swal.fire('Oops! something wrong.', response?.results?.message, 'error');
                }
            }
        } catch (error) {
            await Swal.fire('Error', 'Failed to send request forgot password. Please try again.', 'error');
        }
    }, [payload])

    return (
        <div className="flex items-center justify-center rounded-sm mb-[24px]">
            <div
                className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full border border-1 border-gray-200">
                <FaLock size={80} className="mx-auto mb-4 text-main"/>
                <h1 className="text-2xl font-semibold mb-2">Forgot your Password?</h1>
                <p className="text-gray-600 mb-4">
                    Please enter the email address and we'll send you a link to reset you password.
                </p>

                <>
                    <InputField
                        value={payload.email}
                        setValue={setPayload}
                        nameKey="email"
                    />
                </>
                <Button
                    name={'Request link rest'}
                    fw
                    handleOnClick={handleSubmit}
                />
            </div>
        </div>
    );
}

export default ForgotPassword;
