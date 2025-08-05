import { z } from 'zod';
import { nullishObject } from './utils';

const ReviewSchema = nullishObject({
  id: z.string().uuid(),
  reviewerName: z.string(),
  address: z.string(),
  rating: z.number(),
  reviewComment: z.string(),
  reviewDescription: z.string(),
  category: z.string(),
  date: z.string(),
  meta: nullishObject({
    location: z.string(),
    shortPostalCode: z.string(),
  }),
});

export const ReviewsSchema = nullishObject({
  postcode: z.string(),
  reviews: z.array(ReviewSchema),
});
