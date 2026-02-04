import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,

    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      required: false, // ✅ IMPORTANT (OAuth users)
      select: false,
    },

    provider: {
      type: String,
      default: "credentials", // google / credentials
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isSubscribed: {
      type: Boolean,
      default: false,
    },

    totalOrders: {
      type: Number,
      default: 0,
    },

    totalSpent: {
      type: Number,
      default: 0,
    },

    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    likedProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);
