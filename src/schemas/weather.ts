import { z } from 'zod';
import { nullishObject } from './utils';

export const WeatherSchema = nullishObject({
  latitude: z.number(),
  longitude: z.number(),
  generationtime_ms: z.number(),
  utc_offset_seconds: z.number(),
  timezone: z.string(),
  timezone_abbreviation: z.string(),
  elevation: z.number(),
  daily_units: z.object({
    time: z.string(),
    temperature_2m_max: z.string(),
    precipitation_probability_max: z.string(),
    sunshine_duration: z.string(),
    wind_speed_10m_max: z.string(),
    wind_gusts_10m_max: z.string(),
    precipitation_sum: z.string(),
    precipitation_hours: z.string(),
  }),
  daily: z.object({
    time: z.array(z.string()),
    temperature_2m_max: z.array(z.number()),
    precipitation_probability_max: z.array(z.number()),
    sunshine_duration: z.array(z.number()),
    wind_speed_10m_max: z.array(z.number()),
    wind_gusts_10m_max: z.array(z.number()),
    precipitation_sum: z.array(z.number()),
    precipitation_hours: z.array(z.number()),
  }),
});
