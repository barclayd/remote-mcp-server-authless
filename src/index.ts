import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { McpAgent } from 'agents/mcp';
import { z } from 'zod';
import { bookingInsightsTool } from './tools/bookingInsights';
import { hubspotContactPropertiesTool } from './tools/hubspotContactProperties';
import { hubspotDealPropertiesTool } from './tools/hubspotDealProperties';
import { localAreaInsightsTool } from './tools/localAreaInsights';
import { reviewsTool } from './tools/reviews';
import type { Env } from './types/env';

export class MyMCP extends McpAgent {
  server = new McpServer({
    name: 'Anyvan Booking Insights',
    version: '1.0.0',
  });

  async init() {
    console.log(this.env);

    this.server.tool(
      'get_move_information',
      'Provides specifics about a quote a customer has requested, including largest items they are moving, number of items, the agent they have been interacting with and the details of their move',
      {
        quoteId: z
          .string()
          .describe('ID for quote (e.g. e1005ad0b50919e8c5388851f2af1d55)'),
      },
      bookingInsightsTool,
    );

    this.server.tool(
      'get_anyvan_local_reviews',
      'Returns a list of reviews written by customers who have used Anyvan.com. The reviews are all written by people who moved within the provided postcode. Included in the reviews is a comment left by the reviewer, a description of what they were moving, a rating and metadata such as date and location',
      {
        postalCode: z
          .string()
          .describe(
            'UK Postal Code to use as location for fetching closest reviews (e.g. WA15 8NN, M74HU)',
          ),
      },
      reviewsTool,
    );

    this.server.tool(
      'get_local_area_anyvan_insights',
      'Returns Anyvan-specific insights locally relevant to the provided postcode. Includes the following data points specific to the last month (unless specified otherwise), for the local area specific to Anyvan: total bookings in the area with Anyvan, average home move cost, average four bed home move cost, average savings in specified currency made by customers who have moved with Anyvan vs other removal companies, and the number of quotes received',
      {
        postalCode: z
          .string()
          .describe(
            `UK Postal Code to use as location for fetching locally relevant insights for a customer's move (e.g. WA15 8NN, M74HU)`,
          ),
      },
      localAreaInsightsTool,
    );

    this.server.tool(
      'get_hubspot_deal_properties',
      'Retrieves all relevant properties for a specific quote that are stored on Hubspot. This includes quote price, type of move (category or furniture), the ID of the associated contact record in Hubspot, locale, deal currency, number of times the customer has edited their quote, whether the user was added to the Removals to Furniture flow, how many professional movers will be present for the move, special instructions requested by the customer',
      {
        quoteId: z
          .string()
          .describe(`ID for quote (e.g. e1005ad0b50919e8c5388851f2af1d55)`),
      },
      ({ quoteId }) =>
        hubspotDealPropertiesTool({
          quoteId,
          hubspotAccessToken: (this.env as Env).HUBSPOT_ACCESS_TOKEN,
        }),
    );

    this.server.tool(
      'get_hubspot_contact_properties',
      'Retrieves all relevant properties for a specific contact that are stored on Hubspot. A contact represents a customer. This includes the contacts personal details, their interactions with emails sent by Anyvan and metadata',
      {
        contactId: z
          .string()
          .describe(
            `Hubspot Contact ID. Should be retrieved from get_hubspot_deal_properties.contactId (e.g. 653796301)`,
          ),
      },
      ({ contactId }) =>
        hubspotContactPropertiesTool({
          contactId,
          hubspotAccessToken: (this.env as Env).HUBSPOT_ACCESS_TOKEN,
        }),
    );
  }
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === '/sse' || url.pathname === '/sse/message') {
      return MyMCP.serveSSE('/sse').fetch(request, env, ctx);
    }

    if (url.pathname === '/mcp') {
      return MyMCP.serve('/mcp').fetch(request, env, ctx);
    }

    return new Response('Not found', { status: 404 });
  },
} satisfies ExportedHandler<Env>;
