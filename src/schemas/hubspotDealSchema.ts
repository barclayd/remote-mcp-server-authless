import { z } from 'zod';
import { nullishObject } from './utils';

export const HubspotDealSchema = nullishObject({
  amount: z.string(),
  booked_by_admin: z.enum(['yes', 'no']),
  category_name: z.enum(['Furniture', 'Removals', 'Storage']),
  contact_record_id_sync: z.string(),
  createdate: z.string().datetime(), // ISO 8601
  deal_currency_code: z.string(),
  dealname: z.string(),
  hs_analytics_latest_source: z.string(),
  hs_analytics_source: z.string(),
  hs_deal_stage_probability: z.string(),
  hs_lastmodifieddate: z.string().datetime(),
  hs_object_id: z.string(),
  locale: z.enum(['en-gb', 'es-es']),
  matrix_cubic_meters: z.string(),
  number_of_men: z.string(),
  number_of_pre_listing_edits_made: z.string(),
  quote_price: z.string(),
  removals_to_furniture: z.enum(['yes', 'no']),
  selected_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  special_instructions: z.string(),
  affiliate_admin_lead: z.string(),
  days_until_move: z.string(),
  mileage: z.string(),
  affiliate_agent_name: z.string(),
});
