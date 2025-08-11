import { z } from 'zod';
import { nullishObject } from './utils';

export const BookingInsightsSchema = nullishObject({
  quoteId: z.any(),
  quotePrice: z.any(),
  quoteCurrency: z.any(),
  quoteStatus: z.any(),
  quoteDescription: z.any(),
  scheduledDate: z.any(),
  continueQuoteUrl: z.any(),
  locations: nullishObject({
    pickup: z.object({
      city: z.any(),
      postalCode: z.any(),
      fullAddress: z.any(),
    }),
    delivery: nullishObject({
      city: z.any(),
      postalCode: z.any(),
      fullAddress: z.any(),
    }),
  }),
  items: z.any(),
  itemNamesByVolumeDesc: z.array(z.any()),
  agentInteraction: nullishObject({
    agentName: z.any(),
    agentImageUrl: z.any(),
  }),
});
