import { z } from 'zod';

export const LocalAreaInsights = z.object({
  postcode: z.string(),
  total_bookings: z.string(),
  location: z.string(),
  timePeriod: z.nullable(z.any()),
  meta: z.object({
    shortPostalCode: z.string(),
    associatedTitle: z.string(),
    faqAverageCost: z.string(),
    faqMoveNearMe: z.string(),
    currency: z.string(),
    averageHomeMoveCost: z.string(),
    averageFourBedHomeMoveCost: z.string(),
    averageNumberOfMovesByAgent: z.string(),
    averageSavings: z.string(),
    numberOfQuotesInArea: z.number(),
  }),
});
