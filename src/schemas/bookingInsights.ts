import { z } from 'zod';

export const BookingDataSchema = z.object({
  quoteId: z.string().nullable(),
  quotePrice: z.string().nullable(),
  quoteCurrency: z.string().nullable(),
  quoteStatus: z.string().nullable(),
  quoteDescription: z.string().nullable(),
  scheduledDate: z.string().nullable(),
  continueQuoteUrl: z.string().url().nullable(),
  locations: z
    .object({
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
    })
    .nullable(),
  items: z.number().int().nonnegative().nullable(),
  itemsCount: z.number().int().nonnegative().nullable(),
  itemNamesByVolumeDesc: z.array(z.string()).nullable(),
  moveItems: z.array(z.unknown()).nullable(),
  agentInteraction: z
    .object({
      agentName: z.string(),
      agentImageUrl: z.string().url(),
    })
    .nullable(),
});
