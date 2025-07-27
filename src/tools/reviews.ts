import { ReviewsSchema } from "../schemas/reviews";

export const reviewsTool = async (postalCode: string) => {
    const response = await fetch(
        `https://booking-insights.anyvan.com/v1/bookings/reviews?count=5&postalCode=${postalCode}`,
    );

    if (!response.ok) {
        console.error("Unable to fetch response from bookings/reviews");
    }

    const data = await response.json();

    const reviews = ReviewsSchema.parse(data);

    return { type: "text", text: String(JSON.stringify(reviews)) };
};
