import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './c.css'

export default function CheckoutForm({ clientSecret, userId, serverId, duration }) {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: 'Jenny Rosen',
                },
            },
        });

        if (error) {
            console.log('[error]', error);
        } else {
            console.log('[PaymentIntent]', paymentIntent);

            // Update the user's plans in the database
            fetch('http://localhost:1337/user/update-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId,
                    serverId: serverId,
                    duration: duration,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log('Plan updated successfully:', data);
                })
                .catch((err) => {
                    console.error('Error updating plan:', err);
                });
        }
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>

            <PaymentElement id="payment-element" options={paymentElementOptions} />
            <button disabled={isLoading || !stripe || !elements} id="submit">
                <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
                </span>
            </button>
            {/* Show any error or success messages */}
            {message && <div id="payment-message">{message}</div>}
        </form>
    );
}
