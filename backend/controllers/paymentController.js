
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
console.log("Stripe Secret Key: ", process.env.STRIPE_SECRET_KEY);

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
    const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "usd",  // Use USD if your account is in the US
        metadata: {
          company: "Ecommerce",
        },
    });
    

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});
console.log("Stripe API Key: ", process.env.STRIPE_API_KEY);
exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY});
});
