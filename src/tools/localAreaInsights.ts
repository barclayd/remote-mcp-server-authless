import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { LocalAreaInsights } from '../schemas/localAreaInsights';

export const localAreaInsightsTool = async ({
  postalCode,
}: {
  postalCode: string;
}): Promise<CallToolResult> => {
  const response = await fetch(
    `https://booking-insights.anyvan.com/v1/bookings/count?postalCode=${postalCode}`,
  );

  if (!response.ok) {
    console.error('Unable to fetch response from localAreaInsights');
  }

  const data = await response.json();

  const localAreaInsights = LocalAreaInsights.parse(data);

  return {
    content: [
      { type: 'text', text: String(JSON.stringify(localAreaInsights)) },
    ],
  };
};
