const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        // user_is: String
        cart_id: String,
        userInfo: {
            fullName: String,
            phone: String,
            address: String
        },
        products: [
            {
                product_id: String,
                price: Number,
                discountPercentage: Number,
                quantity: Number
            }
        ]
    },
    { timeStamp: true }
);

const Order = mongoose.model("Order", orderSchema, "orders");