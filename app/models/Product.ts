import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    description: { type: String },
    fabric: { type: String },

    category: { type: String, required: true },        // Kurti, Coord, etc
    subCategory: { type: String },                      // Short kurti, dupatta set
    categoryTheme: { type: String },                    // model / theme

    sizes: [
      {
        size: { type: String, required: true },
        stock: { type: Number, default: 0 },
      },
    ],
    isFestive: {
      type: Boolean,
      default: false,
    },
    colors: [{ type: String }],

    quantity: { type: Number, default: 0 },

    priceOld: { type: Number },
    priceNew: { type: Number, required: true },
    discountPercent: { type: Number },

    couponAllowed: { type: Boolean, default: false },

    mainImage: { type: String, required: true },
    gridImages: [{ type: String }],
    video: { type: String },

    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    categorySlug: {
      type: String,
      required: true,
      index: true, // 🔥 performance
    },
    isActive: {
      type: Boolean,
      default: true,
    },


  },
  { timestamps: true }
);

// Forces regeneration of the model so new fields (like isBestSeller) are picked up
if (mongoose.models.Product) {
  delete mongoose.models.Product;
}

export default mongoose.model("Product", ProductSchema);
