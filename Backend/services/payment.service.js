const Razorpay = require('razorpay');

module.exports.createOrder = async (amount, currency = 'INR') => {
    const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_Tk9TZ7vqO4Dcni';
    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'EShRlOoJOaXJOdFmyzYk2p5u';

    const instance = new Razorpay({
        key_id,
        key_secret
    });

    const options = {
        amount: Math.round(amount * 100), // Amount in paise
        currency,
        receipt: `receipt_${Date.now()}`
    };

    const order = await instance.orders.create(options);
    return order;
};