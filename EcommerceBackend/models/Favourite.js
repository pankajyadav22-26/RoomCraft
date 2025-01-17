const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    favorites: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Favorite", FavoriteSchema);