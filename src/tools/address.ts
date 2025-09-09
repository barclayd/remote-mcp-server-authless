import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { AddressSchema } from '../schemas/address';

export const addressTool = async ({
  latitude,
  longitude,
  mapboxAccessToken,
}: {
  latitude: string;
  longitude: string;
  mapboxAccessToken: string;
}): Promise<CallToolResult> => {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${latitude},${longitude}.json?access_token=${mapboxAccessToken}`,
  );

  if (!response.ok) {
    console.error('Unable to fetch response from mapbox api');
    return {
      content: [
        {
          type: 'text',
          text: `Unable to retrieve address. Error: ${JSON.stringify(await response.json())}`,
        },
      ],
    };
  }

  const data = await response.json();

  const address = AddressSchema.parse(data);

  if (!address.features.length) {
    console.error('No street address found for address');
    return {
      content: [
        {
          type: 'text',
          text: `Unable to find corresponding street address for coordinates. Error: ${JSON.stringify(await response.json())}`,
        },
      ],
    };
  }

  return {
    content: [
      {
        type: 'text',
        text: `The street address for latitude: ${latitude}, longitude: ${longitude}: ${address.features[0].place_name}`,
      },
    ],
  };
};
