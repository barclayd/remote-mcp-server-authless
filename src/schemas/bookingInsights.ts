import { z } from 'zod';
import { nullableObject } from './utils';

export const BookingDataSchema = nullableObject({
  quoteId: z.string(),
  quotePrice: z.string(),
  quoteCurrency: z.string(),
  quoteStatus: z.string(),
  quoteDescription: z.string(),
  scheduledDate: z.string(),
  continueQuoteUrl: z.string().url(),
  locations: nullableObject({
    pickup: z.object({
      city: z.string(),
      postalCode: z.string(),
      fullAddress: z.string(),
    }),
    delivery: nullableObject({
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
