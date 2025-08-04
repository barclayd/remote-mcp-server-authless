import { z } from 'zod';

export const BookingDataSchema = z.object({
  quoteId: z.string(),
  quotePrice: z.string(),
  quoteCurrency: z.string().nullable(),
  quoteStatus: z.string(),
  quoteDescription: z.string().nullable(),
  scheduledDate: z.string().nullable(),
  continueQuoteUrl: z.string().url(),
  locations: z.object({
    pickup: z.object({
      city: z.string(),
      postalCode: z.string(),
      fullAddress: z.string(),
    }),
    delivery: z.object({
      city: z.string(),
      postalCode: z.string(),
      fullAddress: z.string(),
    }),
  }),
  items: z.number().int().nonnegative(),
  itemsCount: z.number().int().nonnegative().nullable(),
  itemNamesByVolumeDesc: z.array(z.string()),
  moveItems: z.array(z.unknown()).nullable(),
  agentInteraction: z.object({
    agentName: z.string(),
    agentImageUrl: z.string().url(),
  }),
});
