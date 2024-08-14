import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import {useEffect} from "react";
import {apiCheckOutOrder, apiSaveTransactionPaypal, apiUpdateOrderStatus} from "../../apis";
import Swal from "sweetalert2";
import path from "../../utils/path";
import {useNavigate} from "react-router-dom";

// This value is from the props in the UI
const style = {"layout": "vertical"};


// Custom component to wrap the PayPalButtons and show loading spinner
const ButtonWrapper = ({currency, showSpinner, amount, payload}) => {
    const [{isPending, options}, dispatch] = usePayPalScriptReducer();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch({
            type: 'resetOptions',
            value: {
                ...options,
                currency,
            }
        });
    }, [currency]);

    const handleCheckOutPayPal = async (payload) => {
        try {
            const response = await apiCheckOutOrder(payload);
            if (response?.results?.statusCode === 200) {
                const {id: orderId} = response?.results?.order;
                await Swal.fire('Check out order successfully.', response?.results?.message, 'success');
                console.log('orderId:', orderId);
                return orderId;
            } else {
                throw new Error('Failed to check out order.');
            }
        } catch (error) {
            console.error(error);
            await Swal.fire('Error', 'Failed to check out order.', 'error');
        }
    };

    const handleSaveTransaction = async (response, orderId) => {
        try {
            const payload = JSON.stringify(response);
            const responseApi = await apiSaveTransactionPaypal({
                payloadResponsePaypal: payload,
                orderId,
            });
            if (responseApi?.results?.statusCode !== 201) {
                throw new Error('Failed to save PayPal transaction');
            }
        } catch (error) {
            console.error(error);
            await Swal.fire('Error', 'Failed to save PayPal transaction.', 'error');
        }
    };

    const handleUpdateOrderStatus = async (orderId) => {
        try {
            const responseApi = await apiUpdateOrderStatus(orderId);
            if (responseApi?.results?.statusCode !== 200) {
                throw new Error('Failed to update order status.');
            }
        } catch (error) {
            console.error(error);
            await Swal.fire('Error', 'Failed to update order status.', 'error');
        }
    };

    return (
        <>
            {(showSpinner && isPending) && <div className="spinner" />}
            <PayPalButtons
                style={style}
                disabled={false}
                forceReRender={[style, currency, amount]}
                fundingSource={undefined}
                createOrder={(data, actions) =>
                    actions.order.create({
                        purchase_units: [{
                            amount: {
                                currency_code: currency,
                                value: amount,
                            },
                        }]
                    }).then((orderId) => orderId)
                }
                onApprove={(data, actions) => {
                    console.log('handleCheckOutPayPal is about to be called with payload:', payload);
                    const orderId = handleCheckOutPayPal(payload).then(orderId => {
                        console.log('Received orderId from handleCheckOutPayPal:', orderId);
                        return actions.order.capture().then(
                            async (response) => {
                                if (response.status === 'COMPLETED') {
                                    await handleUpdateOrderStatus(orderId);
                                    await handleSaveTransaction(response, orderId);
                                    navigate(`/${path.MEMBER}/${path.SUCCESS}/${orderId}`);
                                }
                            }
                        );
                    }).catch(error => {
                        console.error('Error in handleCheckOutPayPal:', error);
                    });
                }}

            />
        </>
    );
};

export default function Paypal({amount, payload}) {
    return (
        <div style={{maxWidth: "750px", minHeight: "150px"}}>
            <PayPalScriptProvider options={{clientId: "test", components: "buttons", currency: "USD"}}>
                <ButtonWrapper payload={payload} currency={'USD'} amount={amount} showSpinner={false} />
            </PayPalScriptProvider>
        </div>
    );
}
