import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { McpAgent } from 'agents/mcp';
import { z } from 'zod';
import { addressTool } from './tools/address';
import { bookingInsightsTool } from './tools/bookingInsights';
import { hubspotContactPropertiesTool } from './tools/hubspotContactProperties';
import { hubspotDealPropertiesTool } from './tools/hubspotDealProperties';
import { localAreaInsightsTool } from './tools/localAreaInsights';
import { prelistingTool } from './tools/prelisting';
import { prelistingHashTool } from './tools/prelistingHash';
import { reviewsTool } from './tools/reviews';
import { transcriptTool } from './tools/transcript';
import { weatherTool } from './tools/weather';
import { getDateInTwoWeeks } from './utils/date';

export class MyMCP extends McpAgent {
  server = new McpServer({
    name: 'Anyvan Booking Insights',
    version: '1.0.0',
  });

  async init() {
    this.server.tool(
      'get_prelisting_hash',
      'Returns a prelistingHash from prelistingId. Required for calling get_move_information, which expects a prelistingHash',
      {
        prelistingId: z
          .string()
          .describe(
            'prelistingId, made up of numeric characters only, that represent a pre-listing (e.g. 23376497)',
          ),
      },
      ({ prelistingId }) =>
        prelistingHashTool({
          prelistingId,
          hubspotAccessToken: (this.env as Env).HUBSPOT_ACCESS_TOKEN,
        }),
    );

    this.server.tool(
      'get_agent_information_for_move',
      'Provides an overview of a quote that a customer has requested, including largest items they are moving, number of items, the agent they have been interacting with and the details of their move',
      {
        prelistingHash: z
          .string()
          .describe(
            'Long hash, made up of alphanumeric characters, that represent a pre-listing (e.g. e1005ad0b50919e8c5388851f2af1d55)',
          ),
      },
      bookingInsightsTool,
    );

    this.server.tool(
      'get_move_information',
      'Provides a full and comprehensive overview of their prelisting quote, including all items, total volume, weight, address information, pricing',
      {
        prelistingHash: z
          .string()
          .describe(
            'Long hash, made up of alphanumeric characters, that represent a pre-listing (e.g. e1005ad0b50919e8c5388851f2af1d55)',
          ),
      },
      prelistingTool,
    );

    this.server.tool(
      'get_anyvan_local_reviews',
      "Returns customer reviews from people who used Anyvan for moves within the specified postcode area. Each review includes the customer's written comment, what they moved, their rating score, and location/date information.",
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
      'get_forecasted_weather_for_date',
      'Returns full forecasted weather conditions for a given latitude and longitude on a given date within the next 14 days.',
      {
        latitude: z.string(),
        longitude: z.string(),
        date: z
          .string()
          .date(
            `Date in the format YYYY-MM-DD (e.g. 2025-08-24). The latest date that can be provided is ${getDateInTwoWeeks()}, otherwise the API will error due to the date being out of the supported range`,
          ),
      },
      weatherTool,
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
        prelistingId: z
          .string()
          .describe(
            `prelistingId, made up of numeric characters only, that represent a pre-listing (e.g. 23376497)`,
          ),
      },
      ({ prelistingId }) =>
        hubspotDealPropertiesTool({
          prelistingId,
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
            `Hubspot contactId. Should be retrieved from get_hubspot_deal_properties.contactId (e.g. 653796301)`,
          ),
      },
      ({ contactId }) =>
        hubspotContactPropertiesTool({
          contactId,
          hubspotAccessToken: (this.env as Env).HUBSPOT_ACCESS_TOKEN,
        }),
    );

    this.server.tool(
      'get_street_address',
      'Converts latitude/longitude coordinates to the nearest street address. Takes decimal degree coordinates (lat: -90 to 90, lon: -180 to 180) and returns structured address components including street, city, state, postal code, and country when available. Returns partial address for remote locations without street-level data.',
      {
        latitude: z.string(),
        longitude: z.string(),
      },
      ({ latitude, longitude }) =>
        addressTool({
          latitude,
          longitude,
          mapboxAccessToken: (this.env as Env).MAPBOX_ACCESS_TOKEN,
        }),
    );

    this.server.tool(
      'get_conversation_transcript',
      'Retrieves a full, human-readable conversation transcript from a Jiminny call. Takes a hubspot dealId as input and returns a formatted back-and-forth dialogue between Customer and Agent, merged from individual transcript segments.',
      {
        dealId: z.string(),
      },
      ({ dealId }) =>
        transcriptTool({
          dealId,
          jiminnyAccessToken: (this.env as Env).JIMINNY_ACCESS_TOKEN,
          hubspotAccessToken: (this.env as Env).HUBSPOT_ACCESS_TOKEN,
          openaiAPIKey: (this.env as Env).OPENAI_API_KEY,
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
