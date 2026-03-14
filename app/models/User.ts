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
      enum: ["user", "admin", "master_admin"],
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
    gender: {
      type: String,
      default: "Prefer not to say",
    },
    dob: String,
    addresses: [
      {
        name: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        pincode: String,
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);
