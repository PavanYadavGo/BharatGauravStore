import React from 'react';

const ReturnPolicy = () => {
    return (
        <div className="max-w-5xl mx-auto p-6 text-gray-800">
            <h1 className="text-3xl font-bold mb-6">Return Policy</h1>

            <p className="mb-4">
                We offer refund / exchange within the first <strong>10 days</strong> from the date of your purchase. If
                <strong>10 days</strong> have passed since your purchase, you will not be offered a return, exchange or refund
                of any kind. In order to become eligible for a return or an exchange, please ensure the following:
            </p>

            <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>The purchased item should be unused and in the same condition as you received it.</li>
                <li>The item must have its original packaging.</li>
                <li>If the item was purchased on sale, it may not be eligible for a return / exchange.</li>
                <li>Only items found to be defective or damaged will be replaced based on an exchange request.</li>
                <li className="mb-4">Damaged and defective products replacement/Exchange will be delivered  with in 5-7 business days.</li>
            </ul>

            <p className="mb-4">
                Please note that certain categories of products / items may be exempted from returns or refunds. These
                categories will be identified to you at the time of purchase.
            </p>

            <p className="mb-4">
                For accepted exchange / return requests, once your returned product / item is received and inspected by
                us, we will send you an email to notify you about the receipt. If your request is approved after the
                quality check, it will be processed in accordance with our policies.
            </p>

            <p className="mt-8">
                If you have any questions about this Policy, please contact us via the information provided on our website.
            </p>
        </div>
    );
};

export default ReturnPolicy;