import { z } from 'zod';
import { nullableObject } from './utils';

export const HubspotContactSchema = nullableObject({
  anyvan_username: z.string(),
  avb_or_av_consumer_: z.enum(['AV Consumer', 'AVB']),
  createdate: z.string().datetime(),
  email: z.string().email(),
  firstname: z.string(),
  hs_email_click: z.null(),
  hs_email_delivered: z.string(),
  hs_email_first_send_date: z.string().datetime(),
  hs_email_last_email_name: z.string(),
  hs_email_last_send_date: z.string().datetime(),
  hs_email_open: z.null(),
  hs_email_sends_since_last_engagement: z.string(),
  hs_object_id: z.string(),
  lastmodifieddate: z.string().datetime(),
  lastname: z.string(),
});
