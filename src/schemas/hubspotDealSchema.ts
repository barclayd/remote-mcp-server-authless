import { z } from 'zod';
import { nullableObject } from './utils';

export const HubspotDealSchema = nullableObject({
  amount: z.string().nullable(),
  booked_by_admin: z.enum(['yes', 'no']).nullable(),
  category_name: z.enum(['Furniture', 'Removals', 'Storage']).nullable(),
  contact_record_id_sync: z.string().nullable(),
  createdate: z.string().datetime().nullable(), // ISO 8601
  deal_currency_code: z.string().nullable(),
  dealname: z.string().nullable(),
  hs_analytics_latest_source: z.string().nullable(),
  hs_analytics_source: z.string().nullable(),
  hs_deal_stage_probability: z.string().nullable(),
  hs_lastmodifieddate: z.string().datetime().nullable(),
  hs_object_id: z.string().nullable(),
  locale: z.enum(['en-gb', 'es-es']).nullable(),
  matrix_cubic_meters: z.string().nullable(),
  number_of_men: z.string().nullable(),
  number_of_pre_listing_edits_made: z.string().nullable(),
  quote_price: z.string().nullable(),
  removals_to_furniture: z.enum(['yes', 'no']).nullable(),
  selected_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable(), // YYYY-MM-DD
  special_instructions: z.string().nullable(),
  affiliate_admin_lead: z.string().nullable(),
  numberOfDaysUntilMoveDate: z.string().nullable(),
  milage: z.string().nullable(),
});
