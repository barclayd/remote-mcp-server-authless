import type {CallToolResult} from '@modelcontextprotocol/sdk/types.js';
import { ReviewsSchema } from "../schemas/reviews";

export const reviewsTool = async ({ postalCode}: {postalCode: string }): Promise<CallToolResult> => {
    const response = await fetch(
        `https://booking-insights.anyvan.com/v1/bookings/reviews?count=5&postalCode=${postalCode}`,
    );

    if (!response.ok) {
        console.error("Unable to fetch response from bookings/reviews");
    }

    const data = await response.json();

    const reviews = ReviewsSchema.parse(data);

    return {
        content: [{ type: "text", text: String(JSON.stringify(reviews)) }],
    };
};
