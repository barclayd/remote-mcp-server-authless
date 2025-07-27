import { z } from 'zod';

const ReviewSchema = z.object({
    id: z.string().uuid(),
    reviewerName: z.string(),
    address: z.string(),
    rating: z.number(),
    reviewComment: z.string(),
    reviewDescription: z.string(),
    category: z.string(),
    date: z.string(),
    meta: z.object({
        location: z.string(),
        shortPostalCode: z.string()
    })
});

export const ReviewsSchema = z.array(ReviewSchema);