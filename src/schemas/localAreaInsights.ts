import { z } from 'zod';
import { nullableObject } from './utils';

export const LocalAreaInsights = nullableObject({
  postcode: z.string(),
  total_bookings: z.string(),
  location: z.string(),
  timePeriod: z.nullable(z.any()),
  meta: nullableObject({
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
