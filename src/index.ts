import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { bookingInsightsTool } from "./tools/bookingInsights";
import { z } from "zod";

export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "Anyvan Booking Insights",
		version: "1.0.0",
	});

	async init() {
		this.server.tool("booking insights data", { quoteId: z.string() }, async ({ quoteId }) => {

			const bookingInsightsResponse = await bookingInsightsTool(quoteId);

			return { content: [{ type: "text", text: bookingInsightsResponse.text}] };
		});
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
