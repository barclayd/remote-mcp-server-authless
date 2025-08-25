import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { WeatherSchema } from '../schemas/weather';

export const weatherTool = async ({
  latitude,
  longitude,
  date,
}: {
  latitude: string;
  longitude: string;
  date: string;
}): Promise<CallToolResult> => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=auto&daily=temperature_2m_max,precipitation_probability_max,sunshine_duration,wind_speed_10m_max,wind_gusts_10m_max,precipitation_sum,precipitation_hours&start_date=${date}&end_date=${date}`,
  );

  if (!response.ok) {
    console.error('Unable to fetch response from weather api');
  }

  const data = await response.json();

  const weather = WeatherSchema.parse(data);

  const formattedForecast = [
    `Max Temperature: ${weather.daily?.temperature_2m_max} ${weather.daily_units?.temperature_2m_max}`,
    `Total sunshine: ${weather.daily?.sunshine_duration} ${weather.daily_units?.sunshine_duration}`,
    `Max wind speed: ${weather.daily?.wind_speed_10m_max} ${weather.daily_units?.wind_speed_10m_max}`,
    `Wind gust of up to: ${weather.daily?.wind_gusts_10m_max} ${weather.daily_units?.wind_gusts_10m_max}`,
    `Total precipitation: ${weather.daily?.precipitation_sum} ${weather.daily_units?.precipitation_sum}`,
    `Number of hours of precipitation: ${weather.daily?.precipitation_hours}`,
  ];

  return {
    content: [
      {
        type: 'text',
        text: `The weather for latitude: ${latitude}, longitude: ${longitude} on ${date}:\n\n${formattedForecast.join('\n')}`,
      },
    ],
  };
};
