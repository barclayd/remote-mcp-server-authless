import { z } from 'zod';
import { nullableObject } from './utils';

const ReviewSchema = nullableObject({
  id: z.string().uuid(),
  reviewerName: z.string(),
  address: z.string(),
  rating: z.number(),
  reviewComment: z.string(),
  reviewDescription: z.string(),
  category: z.string(),
  date: z.string(),
  meta: nullableObject({
    location: z.string(),
    shortPostalCode: z.string(),
  }),
});

export const ReviewsSchema = nullableObject({
  postcode: z.string(),
  reviews: z.array(ReviewSchema),
});
