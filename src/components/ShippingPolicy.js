import React from 'react';

const ShippingPolicy = () => {
    return (
        <div className="max-w-5xl mx-auto p-6 text-gray-800">
            <h1 className="text-3xl font-bold mb-6">Shipping Policy</h1>

            <p className="mb-4">
                The orders for our users are shipped through registered domestic courier companies and/or speed post
                only. Orders are typically shipped within <strong>7 days</strong> from the date of the order and/or payment or
                as per the delivery date agreed at the time of order confirmation.
            </p>

            <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Orders will be delivered in 7 to 10 working days</li>
                <li>Platform Owner shall not be liable for any delay in delivery by the courier company / postal authority.</li>
                <li>Delivery of all orders will be made to the address provided by the buyer at the time of purchase.</li>
                <li>Confirmation of our services will be sent to your email ID as specified during registration.</li>
                <li>Any shipping cost(s) levied by the seller or the Platform Owner are non-refundable.</li>
            </ul>

            <p className="mt-8">
                If you have any questions about this Policy, please contact us via the information provided on our website.
            </p>
        </div>
    );
};

export default ShippingPolicy;