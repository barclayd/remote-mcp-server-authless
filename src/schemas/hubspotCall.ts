import { z } from 'zod';

export const HubspotCallSchema = z.object({
  hs_call_body: z.string(),
});
