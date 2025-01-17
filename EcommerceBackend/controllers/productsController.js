const Product = require('../models/Products')
const Order = require('../models/Order')
const vision = require('@google-cloud/vision');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' }); // Temporary upload location

// Initialize Vision API client
const client = new vision.ImageAnnotatorClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

module.exports = {
    createProduct: async (req, res) => {
        const newProduct = new Product(req.body)
        try {
            await newProduct.save();
            res.status(200).json("product created sucessfully")
        }
        catch (error) {
            res.status(500).json("failed to create the product")
        }
    },
    getAllProducts: async (req, res) => {
        try {
            const products = await Product.find().sort({ createdAt: -1 })
            res.status(200).json(products)
        } catch (error) {
            res.status(500).json("failed to get the products")
        }
    },
    getNewArrivals: async (req, res) => {
        try {
            const newProducts = await Product.find().sort({createdAt: -1}).limit(6)
            res.status(200).json(newProducts)
        } catch (error) {
            res.status(500).json("Failed to get New Arrivals")
        }
    },
    getProduct: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id)
            res.status(200).json(product)
        } catch (error) {
            res.status(500).json("failed to get the product")
        }
    },
    searchProduct: async (req, res) => {
        try {
            const result = await Product.aggregate(
                [
                    {
                        $search: {
                            index: "ReactNativeEcommerce",
                            text: {
                                query: req.params.key,
                                path: {
                                    wildcard: "*"
                                }
                            }
                        }
                    }
                ]
            )
            res.status(200).json(result)
        } catch (error) {
            res.status(500).json("No Products found")
        }
    },
    getTopProducts : async (req, res) => {
        try {
            const topProducts = await Order.aggregate([
                {
                    $group: {
                        _id: "$productId", // Group by productId
                        totalOrders: { $sum: "$quantity" }, // Sum up quantities
                    },
                },
                { $sort: { totalOrders: -1 } }, // Sort by total orders in descending order
                { $limit: 5 }, // Get the top 5 products
                {
                    $lookup: {
                        from: "products", // Collection name for products
                        localField: "_id",
                        foreignField: "_id",
                        as: "productDetails",
                    },
                },
                {
                    $unwind: "$productDetails", // Convert productDetails array to an object
                },
                {
                    $project: {
                        _id: 0,
                        productId: "$_id",
                        totalOrders: 1,
                        title: "$productDetails.title",
                        price: "$productDetails.price",
                        imageUrl: "$productDetails.imageUrl",
                        supplier: "$productDetails.supplier",
                        product_location: "$productDetails.product_location",
                        description: "$productDetails.description",
                    },
                },
            ]);
    
            res.status(200).json(topProducts);
        } catch (error) {
            console.error("Error fetching top products:", error);
            res.status(500).json({ error: "Failed to fetch top products" });
        }
    }
}