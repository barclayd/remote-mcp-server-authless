import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { BookingDataSchema } from '../schemas/bookingInsights';

export const bookingInsightsTool = async ({
  prelistingHash,
}: {
  prelistingHash: string;
}): Promise<CallToolResult> => {
  const response = await fetch(
    `https://booking-insights.anyvan.com/v1/quotes?quoteId=${prelistingHash}`,
  );

  if (!response.ok) {
    console.error('Unable to fetch response from bookingInsights');
  }

  const data = await response.json();

  const bookingInsights = BookingDataSchema.parse(data);

  return {
    content: [{ type: 'text', text: String(JSON.stringify(bookingInsights)) }],
  };
};
