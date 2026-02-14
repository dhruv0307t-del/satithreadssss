import mongoose from "mongoose";

const ContactMessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    subject: {
        type: String,
        required: [true, "Subject is required"],
        trim: true,
    },
    message: {
        type: String,
        required: [true, "Message is required"],
        trim: true,
    },
    status: {
        type: String,
        enum: ["new", "read"],
        default: "new",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ContactMessage =
    mongoose.models.ContactMessage ||
    mongoose.model("ContactMessage", ContactMessageSchema);

export default ContactMessage;
