interface RazorpayOrderData {
    amount: number;
    currency: string;
    receipt: string;
  }
  
  interface RazorpaySuccessResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }