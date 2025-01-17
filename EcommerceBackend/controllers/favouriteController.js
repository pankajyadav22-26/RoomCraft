const Favorite = require('../models/Favourite'); // Import Favorite model

module.exports = {
  addToFavorites: async (req, res) => {
    const { userId, productId } = req.body;

    try {
      // Check if the product is already in the user's favorites
      const existingFavorite = await Favorite.findOne({
        userId,
        "favorites.product": productId, // Check if the product exists in the favorites array
      });

      if (existingFavorite) {
        return res.status(400).json({
          message: "Product is already in your favorites",
        });
      }

      // If not, add the product to the favorites array
      const favorite = await Favorite.findOneAndUpdate(
        { userId },
        {
          $addToSet: { favorites: { product: productId, addedAt: new Date() } }, // Add product to the favorites array if it doesn't already exist
        },
        { upsert: true, new: true } // Create the document if it doesn't exist, or update the existing one
      );

      res.status(200).json({ message: "Product added to favorites", favorite });
    } catch (error) {
      console.error("Error adding to favorites:", error);
      res.status(500).json({ message: "Internal Server Error", error });
    }
  },

  getUserFavorites: async (req, res) => {
    const { userId } = req.params;

    try {
      const favorites = await Favorite.findOne({ userId }).populate(
        "favorites.product",
        "_id title price imageUrl supplier"
      );

      if (!favorites || !favorites.favorites || favorites.length === 0) {
        return res
          .status(404)
          .json({ message: "No favorites found for this user", favorites: [] });
      }

      res.status(200).json({ favorites: favorites.favorites });
    } catch (error) {
      console.error("Error retrieving favorites:", error);
      res.status(500).json({ message: "Internal Server Error", error });
    }
  },

  removeFromFavorites: async (req, res) => {
    const { userId, productId } = req.body;
  
    try {
      const favorite = await Favorite.updateOne(
        { userId },
        { $pull: { favorites: { product: productId } } }
      );
  
      if (favorite.modifiedCount === 0) {
        return res
          .status(404)
          .json({ message: "Product not found in favorites" });
      }
  
      res.status(200).json({ message: "Product removed from favorites" });
    } catch (error) {
      console.error("Error removing from favorites:", error);
      res.status(500).json({ message: "Internal Server Error", error });
    }
  },
};