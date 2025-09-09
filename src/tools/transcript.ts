import { createOpenAI } from '@ai-sdk/openai';
import { Client } from '@hubspot/api-client';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { generateObject } from 'ai';
import { z } from 'zod';
import { HubspotCallSchema } from '../schemas/hubspotCall';
import {
  JiminnyActivitiesSchema,
  JiminnyTranscriptSchema,
} from '../schemas/jiminny';
import { getJiminnyUTCDateFormat } from '../utils/date';
import {
  getJiminnyId,
  getJiminnyIdentificationPrompt,
  JIMINNY_IDENTIFICATION_SYSTEM_PROMPT,
} from '../utils/jiminny';

export const transcriptTool = async ({
  dealId,
  jiminnyAccessToken,
  hubspotAccessToken,
  openaiAPIKey,
}: {
  dealId: string;
  jiminnyAccessToken: string;
  hubspotAccessToken: string;
  openaiAPIKey: string;
}): Promise<CallToolResult> => {
  const hubspotClient = new Client({
    accessToken: hubspotAccessToken,
  });

  const assoc = await hubspotClient.crm.associations.v4.basicApi.getPage(
    'deals',
    dealId,
    'calls',
    undefined,
    100,
  );

  const callIds = (assoc.results || []).map((r) => r.toObjectId);
  if (callIds.length === 0) {
    console.log('No calls associated with this deal.');

    return {
      content: [
        {
          type: 'text',
          text: 'No calls for deal in hubspot',
        },
      ],
    };
  }

  // TODO: extract all calls

  const batchInput = {
    inputs: callIds.map((id) => ({ id: String(id) })),
    properties: ['hs_call_body'],
  };

  const { results } = await hubspotClient.crm.objects.calls.batchApi.read(
    batchInput as any,
  );

  console.log('results', JSON.stringify(results));

  const hubspotCall = HubspotCallSchema.parse(results[0].properties);

  if (!results.length) {
    console.log('No results found in call body');

    return {
      content: [
        {
          type: 'text',
          text: `Unable to retrieve transcription. Error: No call found with an associated jiminnyId`,
        },
      ],
    };
  }

  const callStart = results[0].createdAt;
  const callEnd = new Date(results[0].properties.hs_lastmodifieddate as string);

  const jiminnyId = getJiminnyId(hubspotCall.hs_call_body);

  if (!jiminnyId) {
    console.log('No jiminnyId found in call body');

    return {
      content: [
        {
          type: 'text',
          text: `Unable to retrieve transcription. Error: No call found with an associated jiminnyId`,
        },
      ],
    };
  }

  const transcriptionResponse = await fetch(
    `https://app.jiminny.com/customer/api/v1/getTranscription?activityId=${jiminnyId}`,
    {
      headers: {
        Authorization: `Bearer ${jiminnyAccessToken}`,
      },
    },
  );

  if (!transcriptionResponse.ok) {
    console.error('Unable to fetch response from jiminny transcript');
    return {
      content: [
        {
          type: 'text',
          text: `Unable to retrieve transcription. Error: ${JSON.stringify(await transcriptionResponse.json())}`,
        },
      ],
    };
  }

  const transcriptionData = await transcriptionResponse.json();

  const transcript = JiminnyTranscriptSchema.parse(transcriptionData);

  const participantIds = [
    ...new Set(transcript.map((segment) => segment.participantId)),
  ];

  if (participantIds.length < 2) {
    console.error(
      `Participants found in transcription was less than 2: ${participantIds.join(', ')}`,
    );
    return {
      content: [
        {
          type: 'text',
          text: `Unable to retrieve transcription. Only ${participantIds.length} participants are found on the call`,
        },
      ],
    };
  }

  const openai = createOpenAI({
    apiKey: openaiAPIKey,
  });

  const {
    object: { customerId, agentId },
  } = await generateObject({
    model: openai('gpt-5-mini'),
    schema: z.object({
      customerId: z
        .string()
        .describe('Id that represents the customer in the conversation'),
      agentId: z
        .string()
        .describe(
          'Id that represents the agent from Anyvan in the conversation',
        ),
    }),
    system: JIMINNY_IDENTIFICATION_SYSTEM_PROMPT,
    prompt: getJiminnyIdentificationPrompt(
      JSON.stringify(results[0]),
      JSON.stringify(transcript),
    ),
  });

  if (!customerId || !agentId || customerId === agentId) {
    const activitiesResponse = await fetch(
      `https://app.jiminny.com/customer/api/v1/getActivities?fromDate=${getJiminnyUTCDateFormat(callStart)}&toDate=${getJiminnyUTCDateFormat(callEnd)}`,
      {
        headers: {
          Authorization: `Bearer ${jiminnyAccessToken}`,
        },
      },
    );

    const activitiesData = await activitiesResponse.json();

    const { results: activities } =
      JiminnyActivitiesSchema.parse(activitiesData);

    console.log('activities', JSON.stringify(activities));

    const agent = activities
      .flatMap((activity) => activity.participants)
      .find(
        (participant) =>
          participantIds.includes(participant?.id as string) &&
          participant.user?.teamName !== undefined,
      );

    if (!agent) {
      console.error(
        `Unable to find agent in transcription. participantIds=${participantIds.join(', ')}`,
      );
      return {
        content: [
          {
            type: 'text',
            text: `Unable to recognised agent on the call`,
          },
        ],
      };
    }

    const transcriptByActor = transcript.map((segment) => {
      const actor = segment.participantId === agent.id ? 'Agent' : 'Customer';
      return `${actor}: ${segment.transcript}`;
    });

    return {
      content: [
        {
          type: 'text',
          text: `Conversation:\n\n${transcriptByActor.join('\n')}`,
        },
      ],
    };
  }

  console.log('LLM Actor Detection Succeeded');

  const transcriptByActor = transcript.map((segment) => {
    const actor = segment.participantId === agentId ? 'Agent' : 'Customer';
    return `${actor}: ${segment.transcript}`;
  });

  return {
    content: [
      {
        type: 'text',
        text: `Conversation:\n\n${transcriptByActor.join('\n')}`,
      },
    ],
  };
};
