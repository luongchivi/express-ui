import React, {useCallback, useState} from 'react';
import icons from '../../utils/icons';
import {Button, InputField} from "../../components";
import {apiResendVerifyEmail} from "../../apis/auth";
import Swal from "sweetalert2";
import {validate} from "../../utils/helpers";

const {MdMarkEmailUnread} = icons;

const VerifyEmail = () => {
    const [invalidFields, setInvalidFields] = useState([]);
    const [payload, setPayload] = useState({
        email: '',
    })

    const resetPayload = () => {
        setPayload({
            email: '',
        })
    };

    const handleSubmit = useCallback(async () => {
        try {
            const invalids = validate(payload, setInvalidFields);
            if (invalids === 0) {
                const response = await apiResendVerifyEmail(payload);
                if (response?.results?.statusCode === 200) {
                    await Swal.fire('Resend email successfully.', response?.results?.message, 'success');
                    resetPayload();
                } else {
                    await Swal.fire('Oops! something wrong.', response?.results?.message, 'error');
                    resetPayload();
                }
            }
        } catch (error) {
            await Swal.fire('Error', 'Failed to request resend email. Please try again.', 'error');
        }
    }, [payload])

    return (
        <div className="w-main flex items-center justify-center rounded-sm my-[24px]">
            <div
                className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full border border-1 border-gray-200">
                <MdMarkEmailUnread size={80} className="mx-auto mb-4 text-main"/>
                <h1 className="text-2xl font-semibold mb-2">Verify your email</h1>
                <p className="text-gray-600 mb-4">
                    We've sent an email to "<span className="font-medium">your-email@example.com</span>" to verify your
                    email address and activate your account. The link in the
                    email will expire in 15 minutes.
                </p>
                <>
                    <InputField
                        value={payload.email}
                        setValue={setPayload}
                        nameKey="email"
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                    />
                </>
                <Button
                    fw
                    handleOnClick={handleSubmit}
                >Resend verification link</Button>
            </div>
        </div>
    );
}

export default VerifyEmail;
