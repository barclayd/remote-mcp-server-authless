import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { BookingInsightsSchema } from '../schemas/bookingInsights';

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

  const bookingInsights = BookingInsightsSchema.parse(data);

  const context = {
    prelistingId: bookingInsights.quoteId,
    customerSelectedPrice: bookingInsights.quotePrice,
    propertyType: bookingInsights.quoteDescription,
    selectedMoveDate: bookingInsights.scheduledDate,
    continueQuoteUrl: bookingInsights.continueQuoteUrl,
    pickup: {
      location: {
        city: bookingInsights.locations?.pickup?.city,
        postalCode: bookingInsights.locations?.pickup?.city,
      },
    },
    delivery: {
      location: {
        city: bookingInsights.locations?.pickup?.city,
        postalCode: bookingInsights.locations?.pickup?.city,
      },
    },
    numberOfItemsBeingMoved: bookingInsights.items,
    itemNamesSortedByVolumeDesc: bookingInsights.itemNamesByVolumeDesc,
    agentHandlingMove: {
      name: bookingInsights.agentInteraction?.agentName,
      imageURL: bookingInsights.agentInteraction?.agentImageUrl,
    },
  };

  return {
    content: [{ type: 'text', text: String(JSON.stringify(context)) }],
  };
};
