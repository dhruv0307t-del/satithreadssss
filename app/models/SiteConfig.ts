import mongoose from "mongoose";

const SiteConfigSchema = new mongoose.Schema(
    {
        heroBannerUrl: { type: String },
        festiveBannerUrl: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.SiteConfig || mongoose.model("SiteConfig", SiteConfigSchema);
