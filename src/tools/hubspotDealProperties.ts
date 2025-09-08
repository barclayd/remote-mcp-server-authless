import { Client } from '@hubspot/api-client';
import { FilterOperatorEnum } from '@hubspot/api-client/lib/codegen/crm/deals';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { HubspotDealSchema } from '../schemas/hubspotDealSchema';

export const hubspotDealPropertiesTool = async ({
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
      'dealname',
      'amount',
      'matrix_cubic_meters',
      'deal_currency_code',
      'hs_deal_stage_probability',
      'locale',
      'quote_price',
      'hs_analytics_latest_source',
      'hs_analytics_source',
      'booked_by_admin',
      'contact_record_id_sync',
      'category_name',
      'number_of_men',
      'number_of_pre_listing_edits_made',
      'removals_to_furniture',
      'selected_date',
      'special_instructions',
      'affiliate_agent_name',
      'mileage',
      'days_until_move',
      'affiliate_admin_lead',
      'local_phone_number_formatted',
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

  const hubspotDeal = HubspotDealSchema.parse(
    searchResults.results[0].properties,
  );

  const contextualHubspotDealProperties = {
    amount: hubspotDeal.amount,
    quotePrice: hubspotDeal.quote_price,
    wasBookedBySalesAgent: hubspotDeal.booked_by_admin === 'yes',
    bookingType: hubspotDeal.category_name,
    currency: hubspotDeal.deal_currency_code,
    locale: hubspotDeal.locale,
    anyvanPhoneNumber: hubspotDeal.local_phone_number_formatted,
    probabilityOfDealCompleting: hubspotDeal.hs_deal_stage_probability,
    metadata: {
      createdAt: hubspotDeal.createdate,
      dateLastModified: hubspotDeal.hs_lastmodifieddate,
      dealName: hubspotDeal.dealname,
      editsCount: hubspotDeal.number_of_pre_listing_edits_made,
      prelistingStartedBy: hubspotDeal.pre_listing_started_by,
      utm_source: hubspotDeal.utm_source,
    },
    pickup: {
      longitude: hubspotDeal.from_longitude,
      latitude: hubspotDeal.from_latitude,
    },
    delivery: {
      longitude: hubspotDeal.to_longitude,
      latitude: hubspotDeal.to_latitude,
    },
    pricing: {
      quotePrice: hubspotDeal.quote_price,
      standardPrice: hubspotDeal.removal_standard_price_v4,
      premiumPrice: hubspotDeal.removal_premium_price_v4,
    },
    customer: {
      maxStepMadeInFlow: hubspotDeal.pre_listing_max_step,
      lastInteractionCustomerHadWithTheirQuote:
        hubspotDeal.removal_pre_listing_last_interaction,
    },
    moveSizeInCubicMetres: hubspotDeal.matrix_cubic_meters,
    numberOfMovers: hubspotDeal.number_of_men,
    isR2FFlow: hubspotDeal.removals_to_furniture,
    moveDate: hubspotDeal.selected_date,
    specialInstructionsFromCustomer: hubspotDeal.special_instructions,
    contactId: hubspotDeal.contact_record_id_sync,
    leadSource: hubspotDeal.affiliate_admin_lead,
    numberOfDaysUntilMoveDate: hubspotDeal.days_until_move,
    moveDistanceInMiles: hubspotDeal.mileage,
    affiliateAgentName: hubspotDeal.affiliate_agent_name,
  };

  const contactIdContext = `The contactId for this Hubspot deal is ${hubspotDeal.contact_record_id_sync} and should be used to look up relevant information about the Contact on hubspot`;

  return {
    content: [
      {
        type: 'text',
        text: String(
          JSON.stringify({
            context: contactIdContext,
            contextualHubspotDealProperties,
          }),
        ),
      },
    ],
  };
};
