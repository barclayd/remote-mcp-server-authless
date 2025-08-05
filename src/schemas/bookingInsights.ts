import { z } from 'zod';
import { nullishObject } from './utils';

export const BookingDataSchema = nullishObject({
  quoteId: z.string(),
  quotePrice: z.string(),
  quoteCurrency: z.string(),
  quoteStatus: z.string(),
  quoteDescription: z.string(),
  scheduledDate: z.string(),
  continueQuoteUrl: z.string().url(),
  locations: nullishObject({
    pickup: z.object({
      city: z.string(),
      postalCode: z.string(),
      fullAddress: z.string(),
    }),
    delivery: nullishObject({
      city: z.string(),
      postalCode: z.string(),
      fullAddress: z.string(),
    }),
  }),
  items: z.number().int().nonnegative(),
  itemsCount: z.number().int().nonnegative(),
  itemNamesByVolumeDesc: z.array(z.string()),
  moveItems: z.array(z.unknown()),
  agentInteraction: z.object({
    agentName: z.string(),
    agentImageUrl: z.string().url(),
  }),
});
