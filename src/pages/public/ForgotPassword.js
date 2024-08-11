import React, {useCallback, useState} from 'react';
import {Button, InputField, Loading} from "components";
import icons from 'utils/icons';
import {apiForgotPassword} from "apis";
import Swal from "sweetalert2";
import {validate} from "utils/helpers";
import {showModal} from "../../store/app/appSlice";
import {useDispatch} from "react-redux";

const {FaLock} = icons;

const ForgotPassword = () => {
    const [invalidFields, setInvalidFields] = useState([]);
    const [payload, setPayload] = React.useState({
        email: '',
    });
    const dispatch = useDispatch();

    const resetPayload = () => {
        setPayload({
            email: '',
        })
    };

    const handleSubmit = useCallback(async () => {
        try {
            const invalids = validate(payload, setInvalidFields);
            if (invalids === 0) {
                dispatch(showModal({isShowModal: true, modalChildren: <Loading />}))
                const response = await apiForgotPassword(payload);
                dispatch(showModal({isShowModal: false, modalChildren: null}))
                if (response?.results?.statusCode === 200) {
                    await Swal.fire('Request forgot password successfully.', response?.results?.message, 'success');
                    resetPayload();
                } else {
                    await Swal.fire('Oops! something wrong.', response?.results?.message, 'error');
                    resetPayload();
                }
            }
        } catch (error) {
            await Swal.fire('Error', 'Failed to send request forgot password. Please try again.', 'error');
        }
    }, [payload])

    return (
        <div className="w-main flex items-center justify-center rounded-sm my-[24px]">
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
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                    />
                </>
                <Button
                    fw
                    handleOnClick={handleSubmit}
                >Request link rest</Button>
            </div>
        </div>
    );
}

export default ForgotPassword;
