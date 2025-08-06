import { z } from 'zod';
import { nullishObject } from './utils';

const ServiceSchema = nullishObject({
  service_id: z.number(),
  type: z.string(),
  category_service_id: z.number(),
  category_id: z.number(),

  name: z.string(),
  description: z.string().nullable(),
  icon: z.string(),
  order: z.number(),
  locale: z.string(),
  version: z.number().nullable(),

  base_price: z.number(),
  unit_price: z.number(),
  rate_price: z.number(),
  min_price: z.number(),
  units: z.string(),

  excess: z.number(),
  excess_rate: z.number(),
  cover: z.number().nullable(),

  international_cover: z.number().nullable(),
  international_rate_price: z.number(),
  international_min_price: z.number(),
  international_excess: z.number(),
  international_excess_rate: z.number(),
  international_available: z.number(),

  limit: z.number().nullable(),
  standard_plus_limit: z.number().optional(),

  inc_tax: z.number(),
  tax_rate: z.number(),
  tax_type: z.number(),

  fee_numerator: z.number(),
  fee_denominator: z.number(),

  cutoff_time: z.string().nullable(),

  visible_for_admin: z.number().nullable(),
  visible_for_customer: z.number().nullable(),
  visible_for_provider: z.number().nullable(),
  customer_can_add: z.number().nullable(),

  basedOnValueOfGoods: z.boolean(),
});

export const AdditionalServiceSchema = z.array(ServiceSchema);
