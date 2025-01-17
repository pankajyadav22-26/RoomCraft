const Order = require('../models/Order')
const Product = require('../models/Products'); 
const mongoose = require('mongoose')

module.exports = {
    getUserOrders : async (req, res) => {
        const userId = req.params.id;
    
        try {
            const userOrders = await Order.find({ userId })
                .populate({
                    path: 'productId',
                    select: '-description -product_location', // We select only 'name' from productId
                })
                .exec();
    
            res.status(200).json(userOrders);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    addToOrders: async (req, res) => {
        try {
            const { cartItems, userId, customerId, totalAmount, paymentStatus } = req.body;

            if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
                return res.status(400).json({ error: 'Cart items should be a non-empty array' });
            }
            if (!userId || !customerId || !totalAmount || !paymentStatus) {
                return res.status(400).json({ error: 'Missing required data' });
            }
    
            const orderPromises = cartItems.map(async (cartItem) => {
                const product = cartItem.cartItem;
    
                if (!product || !product._id || !product.price || !cartItem.quantity) {
                    throw new Error(`Invalid cart item structure for product ${product ? product._id : 'unknown'}`);
                }
    
                if (!mongoose.Types.ObjectId.isValid(product._id)) {
                    throw new Error(`Invalid product ID: ${product._id}`);
                }

                const productData = await Product.findById(product._id);
                if (!productData) {
                    throw new Error(`Product with ID ${product._id} not found`);
                }
    
                const order = new Order({
                    userId,
                    customerId,
                    productId: product._id,
                    quantity: cartItem.quantity,
                    subtotal: productData.price * cartItem.quantity, // Use price from the database
                    total: totalAmount,
                    payment_status: paymentStatus,
                });
    
                await order.save();
            });
    
            await Promise.all(orderPromises);
    
            res.status(201).json({ message: 'Order(s) created successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}