import mongoose, { Schema, models } from "mongoose";

const AdminLogSchema = new Schema(
    {
        adminId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        adminEmail: {
            type: String,
            required: true,
        },

        action: {
            type: String,
            required: true,
            enum: [
                "password_changed",
                "password_changed_self",
                "admin_created",
                "admin_deleted",
                "admin_demoted",
                "admin_promoted",
                "master_admin_promoted",
                "user_updated",
            ],
        },

        targetUserId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        targetUserEmail: {
            type: String,
        },

        details: {
            type: String,
        },

        ipAddress: {
            type: String,
        },
    },
    { timestamps: true }
);

// Index for faster queries
AdminLogSchema.index({ adminId: 1, createdAt: -1 });
AdminLogSchema.index({ action: 1, createdAt: -1 });

export default models.AdminLog || mongoose.model("AdminLog", AdminLogSchema);
