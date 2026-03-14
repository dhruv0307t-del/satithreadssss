export const SHIPPING_REGIONS = {
    northEast: [
        "Arunachal Pradesh",
        "Assam",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Tripura",
        "Sikkim"
    ],
    northIndia: [
        "Jammu & Kashmir",
        "Jammu and Kashmir",
        "Himachal Pradesh",
        "Haryana",
        "Punjab",
        "Uttarakhand",
        "Uttar Pradesh",
        "Delhi" // Added here for general North category, but Delhi has its own rate according to user
    ]
};

export function calculateShippingFee(
    subtotal: number,
    city: string,
    state: string,
    isExpress: boolean = false
): number {
    let baseShipping = 0;
    const normalizedCity = city.toLowerCase().trim();
    const normalizedState = state.toLowerCase().trim();

    // 1. Identify Region and Base Rate
    if (normalizedCity === "jaipur") {
        if (subtotal > 999) {
            baseShipping = 0;
        } else {
            baseShipping = 25;
        }
    } else if (normalizedState === "rajasthan") {
        baseShipping = 45;
    } else if (normalizedState === "delhi") {
        baseShipping = 90;
    } else if (
        SHIPPING_REGIONS.northEast.some((s) => normalizedState === s.toLowerCase())
    ) {
        baseShipping = 300;
    } else if (
        SHIPPING_REGIONS.northIndia.some((s) => normalizedState === s.toLowerCase())
    ) {
        baseShipping = 45;
    } else {
        // Rest of India
        baseShipping = 100;
    }

    // 2. Global Free Shipping Threshold (Excluding North East & Sikkim)
    // User said: "if ... cart value is more than 1499 then shipping free all over india except sikkim and north east"
    const isNorthEastOrSikkim = SHIPPING_REGIONS.northEast.some(
        (s) => normalizedState === s.toLowerCase()
    );

    if (!isNorthEastOrSikkim && subtotal > 1499) {
        baseShipping = 0;
    }

    // 3. Express Delivery
    // User said: "if they ask for express delivery then extra 50 ... this express price apply for all cost no exemption"
    const expressFee = isExpress ? 50 : 0;

    return baseShipping + expressFee;
}
