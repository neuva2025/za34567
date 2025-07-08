import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Razorpay from 'razorpay';
import crypto from 'crypto';

admin.initializeApp();

const razorpay = new Razorpay({
  key_id: functions.config().razorpay.key_id,
  key_secret: functions.config().razorpay.key_secret
});

export const createRazorpayOrder = functions.https.onCall(
  async (data: RazorpayOrderData, context: functions.https.CallableContext) => {
    const { amount, currency = 'INR', receipt = 'order_rcptid_11' } = data;

    try {
      const order = await razorpay.orders.create({
        amount: amount * 100,
        currency,
        receipt,
      }) as RazorpayOrderResponse;

      return { orderId: order.id };
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw new functions.https.HttpsError('internal', 'Unable to create Razorpay order');
    }
  }
);

export const verifyRazorpayPayment = functions.https.onCall(
  async (data: RazorpayPaymentVerificationData, context: functions.https.CallableContext) => {
    const { orderCreationId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = data;

    // Verify signature
    const shasum = crypto.createHmac('sha256', functions.config().razorpay.key_secret);
    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpaySignature) {
      throw new functions.https.HttpsError('invalid-argument', 'Transaction not legit!');
    }

    // If verification is successful, you can update your database here
    return { verified: true };
  }
);