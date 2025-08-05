import { z } from 'zod';
import { nullishObject } from './utils';

export const LocalAreaInsights = nullishObject({
  postcode: z.string(),
  total_bookings: z.string(),
  location: z.string(),
  timePeriod: z.nullable(z.any()),
  meta: nullishObject({
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
