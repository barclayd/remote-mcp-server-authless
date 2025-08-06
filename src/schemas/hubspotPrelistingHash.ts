import { z } from 'zod';
import { nullishObject } from './utils';

export const HubspotPrelistingHash = nullishObject({
  pre_listing_hash: z.string(),
  prelisting_token: z.string(),
  pre_listing_url: z.string().url(),
  pre_listing_brochure: z.string().url(),
});
