import { Client } from '@hubspot/api-client';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { HubspotContactSchema } from '../schemas/hubspotContactSchema';

export const hubspotContactPropertiesTool = async ({
  contactId,
  hubspotAccessToken,
}: {
  contactId: string;
  hubspotAccessToken: string;
}): Promise<CallToolResult> => {
  const hubspotClient = new Client({
    accessToken: hubspotAccessToken,
  });

  const hubspotContact = await hubspotClient.crm.contacts.basicApi.getById(
    contactId,
    [
      'firstname',
      'lastname',
      'email',
      'anyvan_username',
      'avb_or_av_consumer_',
      'hs_email_last_email_name',
      'hs_email_last_send_date',
      'hs_email_first_send_date',
      'hs_email_delivered',
      'hs_email_click',
      'hs_email_open',
      'hs_email_sends_since_last_engagement',
    ],
  );

  const hubspotContactProperties = HubspotContactSchema.parse(
    hubspotContact.properties,
  );

  const contextualHubspotDealProperties = {
    username: hubspotContactProperties.anyvan_username,
    firstName: hubspotContactProperties.firstname,
    lastName: hubspotContactProperties.lastname,
    email: hubspotContactProperties.email,
    isCustomer: hubspotContactProperties.avb_or_av_consumer_ === 'AV Consumer',
    emailData: {
      numberOfMarketingEmailsClicked: hubspotContactProperties.hs_email_click,
      numberOfMarketingEmailsSent: hubspotContactProperties.hs_email_delivered,
      dateFirstMarketingEmailSent:
        hubspotContactProperties.hs_email_first_send_date,
      dateLastMarketingEmailSent:
        hubspotContactProperties.hs_email_last_send_date,
      nameOfLastMarketingEmailSent:
        hubspotContactProperties.hs_email_last_email_name,
      numberOfMarketingEmailsSentSinceCustomerLastEngagedWithEmail:
        hubspotContactProperties.hs_email_sends_since_last_engagement,
      numberOfMarketingEmailsOpened: hubspotContactProperties.hs_email_open,
    },
    metadata: {
      createdAt: hubspotContactProperties.createdate,
      updatedAt: hubspotContactProperties.lastmodifieddate,
    },
  };

  return {
    content: [
      {
        type: 'text',
        text: String(JSON.stringify(contextualHubspotDealProperties)),
      },
    ],
  };
};
