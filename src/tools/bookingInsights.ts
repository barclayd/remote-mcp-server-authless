import { BookingDataSchema } from "../schemas/bookingInsights";

export const bookingInsightsTool = async (quoteId: string) => {
	const response = await fetch(
		`https://booking-insights.anyvan.com/v1/quotes?quoteId=${quoteId}`,
	);

	if (!response.ok) {
		console.error("Unable to fetch response from bookingInsights");
	}

	const data = await response.json();

	const bookingInsights = BookingDataSchema.parse(data);

	return { type: "text", text: String(JSON.stringify(bookingInsights)) };
};
