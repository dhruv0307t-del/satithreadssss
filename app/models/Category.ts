import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
    title: string;
    slug: string;
    thumbnail?: string;
    headerImage?: string;
    order?: number;
}

const CategorySchema = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        thumbnail: { type: String },
        headerImage: { type: String },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

if (mongoose.models.Category) {
    delete mongoose.models.Category;
}

export const Category = mongoose.model<ICategory>("Category", CategorySchema);
