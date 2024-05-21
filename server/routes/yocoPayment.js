const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/create-checkout", async (req, res) => {
  try {
     const { subtotal, cartItems, userId, discounts, tax } = req.body; // Extract subtotal from the request body
    
    /* Calculate total amount including discounts and tax
    let totalAmount = subtotal;
    if (discounts) {
      discounts.forEach(discount => {
        totalAmount -= discount.amount;
      });
    }

    if (tax) {
      totalAmount += tax.amount;
    }*/

     // Multiply subtotal by 100 to convert to the smallest currency unit
    const amountInSmallestUnit = subtotal * 100;

     // Prepare the request body for Yoco's API
     const checkoutDetails = {
       amount: amountInSmallestUnit, // Use the subtotal as the amount
       currency: "ZAR", // Example currency
       /*lineItems: cartItems, // Include line items
       discounts: discounts, // Include discounts
       tax: tax, // Include tax*/
       // Add any other required details here
     };
 
     // Make a POST request to Yoco's API to create a checkout session
     const response = await axios.post(
       "https://payments.yoco.com/api/checkouts",
       checkoutDetails,
       {
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${process.env.YOCO_SECRET_KEY}`,
         },
       }
     );
 
     // Extract the redirect URL from the response
     const checkoutUrl = response.data.redirectUrl;
 
     // Send the checkout URL to the client
     res.json({ checkoutUrl });
  } catch (error) {
     console.error(error);
     res.status(500).send("Error creating checkout session");
  }
 });

 // Placeholder for handlinf Yoco webhook
 router.post("/webhook", express.json({ type: "application/json"}), async (req, res) => {
  try {
    //Example: Extract payment details from the request body
    const paymentDetails = req.body;
    // Example: Retrieve the customer and line items (if applicable)
    // This will depend on how Yoco sends payment event data

    // Create an order after a successful payment
    // This is a placeholder. You'll need to adjust this based on Yoco's webhook data structure
    const customer = { metadata: { userId: paymentDetails.userId } }; // Example customer object
    const lineItems = []; // Example line items array
    createOrder(customer, paymentDetails, lineItems);

    res.status(200).end();
 } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while processing the Yoco webhook.");
 }
});
  
 //Create an order function
 const createOrder = async (customer, data, lineItems) => {
  try {
    const newOrder = new Order({
      userId: customer.metadata.userId,
      // Add other necessary fields based on your Order Model
    });

    const savedOrder = await newOrder.save();
    console.log("Processed Order:", savedOrder);
  } catch (err) {
    console.error(err);
  }
 };
 

module.exports = router;
