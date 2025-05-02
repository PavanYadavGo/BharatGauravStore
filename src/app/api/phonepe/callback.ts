import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { db } from '../../../helpers/firebaseConfig'; // Adjust the path as needed
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore'; // Import Firebase functions

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const response = req.body.response; // PhonePe sends the base64 encoded response in the 'response' field
      const saltKey = process.env.PHONEPE_CLIENT_SECRET?.substring(0, 32); // First 32 chars of secret
      const merchantTransactionId = req.body.merchantTransactionId; // Included in the callback

      if (!response || !saltKey || !merchantTransactionId) {
        console.error('Callback parameters missing:', req.body);
        return res.status(400).send('Callback parameters missing');
      }

      const checksum = req.headers['x-verify'];
      const stringToVerify = `${response}/pg/v1/status${saltKey}`;
      const calculatedChecksum = crypto.createHash('sha256').update(stringToVerify).digest('hex') + '###1'; // Assuming salt index 1

      if (checksum !== calculatedChecksum) {
        console.error('Checksum verification failed:', { received: checksum, calculated: calculatedChecksum });
        return res.status(400).send('Checksum verification failed');
      }

      const decodedResponse = JSON.parse(Buffer.from(response, 'base64').toString('utf-8'));
      const paymentStatus = decodedResponse.code; // 'PAYMENT_SUCCESS' or other status codes
      const transactionId = decodedResponse.data?.transactionId;
      const providerReferenceId = decodedResponse.data?.providerReferenceId;

      console.log('PhonePe Callback Response:', decodedResponse);

      // Extract the order ID (you might have stored it in the merchantTransactionId)
      const orderId = merchantTransactionId.split('_').slice(-1)[0]; // Assuming your TXN format

      // Update your order status in Firebase
      if (orderId && transactionId) {
        const orderRef = doc(db, 'orders', orderId); // Assuming your order ID is the Firebase document ID
        await updateDoc(orderRef, {
          paymentStatus: paymentStatus === 'PAYMENT_SUCCESS' ? 'Paid' : 'Failed',
          paymentId: transactionId,
          providerReferenceId: providerReferenceId || '',
          updatedAt: serverTimestamp(),
        });

        console.log(`Order ${orderId} updated with status: ${paymentStatus}`);
      } else {
        console.error('Order ID or Transaction ID missing in callback response.');
      }

      // Redirect the user to a success or failure page on your website
      if (paymentStatus === 'PAYMENT_SUCCESS') {
        res.redirect(302, `/payment/success?orderId=${orderId}`);
      } else {
        res.redirect(302, `/payment/failure?orderId=${orderId}`);
      }
    } catch (error: any) {
      console.error('Error handling PhonePe callback:', error);
      return res.status(500).send(`Error processing callback: ${error.message}`);
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}