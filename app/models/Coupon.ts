import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true },
        discount: { type: Number, required: true },
        type: { type: String, enum: ["flat", "percent"], required: true }, // 'flat' or 'percent'
        minCartValue: { type: Number, default: 0 },
        imageUrl: { type: String }, // For the popup display
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
