import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as Razorpay from 'razorpay';

admin.initializeApp();

// Initialize Razorpay with the keys from Firebase config
const razorpay = new Razorpay({
  key_id: functions.config().razorpay.key_id,  // Retrieve the key_id from environment variable
  key_secret: functions.config().razorpay.key_secret  // Retrieve the key_secret from environment variable
});

// Firebase Function to create a Razorpay order
export const createRazorpayOrder = functions.https.onCall(async (data, context) => {
  const { amount, currency = 'INR', receipt = 'order_rcptid_11' } = data;

  try {
    // Create the Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise (100 paise = 1 INR)
      currency,
      receipt,
    });

    // Return the order ID to the client
    return { orderId: order.id };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new functions.https.HttpsError('internal', 'Unable to create Razorpay order');
  }
});
