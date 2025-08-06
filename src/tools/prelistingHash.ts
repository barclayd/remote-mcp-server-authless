import { Client } from '@hubspot/api-client';
import { FilterOperatorEnum } from '@hubspot/api-client/lib/codegen/crm/deals';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { HubspotPrelistingHash } from '../schemas/hubspotPrelistingHash';
import {
  extractListingIdFromPrelistingURL,
  extractPreListingIdFromBrochureURL,
} from '../utils';

export const prelistingHashTool = async ({
  prelistingId,
  hubspotAccessToken,
}: {
  prelistingId: string;
  hubspotAccessToken: string;
}): Promise<CallToolResult> => {
  const hubspotClient = new Client({
    accessToken: hubspotAccessToken,
  });

  const searchResults = await hubspotClient.crm.deals.searchApi.doSearch({
    filterGroups: [
      {
        filters: [
          {
            propertyName: 'pre_listing_id',
            operator: FilterOperatorEnum.Eq,
            value: prelistingId,
          },
        ],
      },
    ],
    properties: [
      'pre_listing_hash',
      'pre_listing_url',
      'prelisting_token',
      'pre_listing_brochure',
    ],
    limit: 1,
  });

  if (searchResults.results.length !== 1) {
    return {
      content: [
        {
          type: 'text',
          text: 'Hubspot Contact Properties errored. Please use an alternative data source',
        },
      ],
    };
  }

  const hubspotDeal = HubspotPrelistingHash.parse(
    searchResults.results[0].properties,
  );

  let prelistingHash =
    hubspotDeal.prelisting_token ?? hubspotDeal.pre_listing_hash;

  if (!prelistingHash) {
    prelistingHash = extractListingIdFromPrelistingURL(
      hubspotDeal.pre_listing_url,
    );
  }

  if (!prelistingHash) {
    prelistingHash = extractPreListingIdFromBrochureURL(
      hubspotDeal.pre_listing_brochure,
    );
  }

  const context = `For prelistingId: ${prelistingId}, this is the corresponding prelistingHash: ${prelistingHash}`;

  return {
    content: [
      {
        type: 'text',
        text: String(
          JSON.stringify({
            context,
            prelistingHash,
          }),
        ),
      },
    ],
  };
};
