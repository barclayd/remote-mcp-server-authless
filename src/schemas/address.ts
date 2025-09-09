import { z } from 'zod';

export const AddressSchema = z.object({
  features: z.array(
    z.object({
      place_name: z.string(),
    }),
  ),
});
