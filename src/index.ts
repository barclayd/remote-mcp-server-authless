import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { reviewsTool } from './tools/reviews';
import { bookingInsightsTool } from "./tools/bookingInsights";
import { z } from "zod";

export class MyMCP extends McpAgent {
  server = new McpServer({
    name: "Anyvan Booking Insights",
    version: "1.0.0",
  });

  async init() {
    this.server.tool(
      "insights",
      "Provides specifics about a quote a customer has requested, including largest items they are moving, number of items, the agent they have been interacting with and the details of their move",
      {
        quoteId: z
          .string()
          .describe("ID for quote (e.g. e1005ad0b50919e8c5388851f2af1d55)"),
      },
      async ({ quoteId }) => {
        const bookingInsightsResponse = await bookingInsightsTool(quoteId);

        return {
          content: [{ type: "text", text: bookingInsightsResponse.text }],
        };
      },
    );
    this.server.tool(
      "reviews",
      "Returns a list of reviews written by customers who have used Anyvan.com. The reviews are all written by people who moved within the provided postcode. Included in the reviews is a comment left by the reviewer, a description of what they were moving, a rating and metadata such as date and location",
      {
        postalCode: z
          .string()
          .describe("UK Postal Code to use as location for fetching closest reviews (e.g. WA15 8NN, M74HU)"),
      },
        reviewsTool,
    );
  }
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/sse" || url.pathname === "/sse/message") {
      return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
    }

    if (url.pathname === "/mcp") {
      return MyMCP.serve("/mcp").fetch(request, env, ctx);
    }

    return new Response("Not found", { status: 404 });
  },
};
