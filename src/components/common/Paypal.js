import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import {useEffect} from "react";
import {apiCheckOutOrder, apiSaveTransactionPaypal, apiUpdateOrderStatusUser} from "../../apis";
import Swal from "sweetalert2";
import path from "../../utils/path";
import {useNavigate} from "react-router-dom";

// This value is from the props in the UI
const style = {"layout": "vertical"};

// Custom component to wrap the PayPalButtons and show loading spinner
const ButtonWrapper = ({currency, showSpinner, amount, payload, cart}) => {
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

            if (response.status === 'COMPLETED') {
                const responseApi = await apiSaveTransactionPaypal({
                    payloadResponsePaypal: payload,
                    orderId,
                });
                if (responseApi?.results?.statusCode !== 201) {
                    throw new Error('Failed to save PayPal transaction');
                }
            } else {
                // Handle error scenario
                await apiSaveTransactionPaypal({
                    payloadResponsePaypal: JSON.stringify({
                        rawResponse: response,
                        intent: 'FAILED'
                    }),
                    orderId
                });
                const responseApi = await apiSaveTransactionPaypal({
                    payloadResponsePaypal: payload,
                    orderId,
                });
                if (responseApi?.results?.statusCode !== 201) {
                    throw new Error('Failed to save PayPal transaction');
                }
            }
        } catch (error) {
            console.error(error);
            await Swal.fire('Error', 'Failed to save PayPal transaction.', 'error');
        }
    };

    const handleUpdateOrderStatus = async (orderId) => {
        try {
            const responseApi = await apiUpdateOrderStatusUser(orderId);
            if (responseApi?.results?.statusCode !== 200) {
                throw new Error('Failed to update order status.');
            }
        } catch (error) {
            console.error(error);
            await Swal.fire('Error', 'Failed to update order status.', 'error');
        }
    };

    const totalItemAmount = cart.cart.reduce((acc, item) => acc + (Math.trunc(item.unitPrice / 23500) * item.quantity), 0);
    const totalAmount = totalItemAmount + cart.shippingFee;

    return (
        <>
            {(showSpinner && isPending) && <div className="spinner"/>}
            <PayPalButtons
                style={style}
                disabled={false}
                forceReRender={[style, currency, amount]}
                fundingSource={undefined}
                createOrder={(data, actions) =>
                    actions.order.create({
                        purchase_units: [
                            {
                                items: cart.cart.map((item) => ({
                                    name: item.product.name,
                                    unit_amount: {
                                        currency_code: currency,
                                        value: Math.trunc(item.unitPrice / 23500),
                                    },
                                    quantity: item.quantity,
                                })),
                                amount: {
                                    currency_code: currency,
                                    value: totalAmount,
                                    breakdown: {
                                        item_total: {
                                            currency_code: currency,
                                            value: totalItemAmount,
                                        },
                                        shipping: {
                                            currency_code: currency,
                                            value: cart.shippingFee,
                                        },
                                    }
                                },
                            }
                        ]
                    }).then((orderId) => orderId)
                }
                onApprove={(data, actions) => {
                    handleCheckOutPayPal(payload).then(orderId => {
                        return actions.order.capture().then(
                            async (response) => {
                                if (response.status === 'COMPLETED') {
                                    await handleUpdateOrderStatus(orderId);
                                    await handleSaveTransaction(response, orderId);
                                    navigate(`/${path.MEMBER}/${path.SUCCESS}/${orderId}`);
                                } else {
                                    await Swal.fire('Error', 'Payment not completed.', 'error');
                                    throw new Error('Payment not completed.');
                                }
                            }
                        ).catch(async (error) => {
                            await handleSaveTransaction({
                                status: 'FAILED',
                                ...error
                            }, orderId);
                            await Swal.fire('Error', 'Payment not completed.', 'error');
                            throw new Error('Payment not completed.');
                        });
                    }).catch(error => {
                        console.error('Error in handleCheckOutPayPal:', error);
                    });
                }}
            />
        </>
    );
};

export default function Paypal({amount, payload, cart}) {
    return (
        <div style={{maxWidth: "750px", minHeight: "150px"}}>
            <PayPalScriptProvider options={{clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID, components: "buttons", currency: "USD"}}>
                <ButtonWrapper
                    cart={cart}
                    payload={payload}
                    currency={'USD'}
                    amount={amount}
                    showSpinner={false}
                />
            </PayPalScriptProvider>
        </div>
    );
}
