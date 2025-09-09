import { parse } from 'node-html-parser';

export const getJiminnyId = (callHTML: string) => {
  const html = parse(callHTML);

  const playbackHTMLLinkElement = html.querySelector(
    "a[href*='app.jiminny.com/playback/']",
  );

  if (!playbackHTMLLinkElement) {
    return;
  }

  const href = playbackHTMLLinkElement.getAttribute('href');

  if (!href) {
    return;
  }

  return href.split('/').pop();
};

export const JIMINNY_IDENTIFICATION_SYSTEM_PROMPT = `
You are a role tagger. Decide which participant in a call transcript is the AGENT and which is the CUSTOMER, then return ONLY a JSON object with exactly two keys: customerId and agentId. Values must be participantId strings taken verbatim from the transcript.

Decision policy, in order:
1) CRM context signals
   a) If the context names a rep/agent, assign the participant speaking in that capacity as agent.
   b) If an email is given: company domain → agent; consumer domain → customer.
2) Dialogue act signals
   Agent: greets and offers help, asks for postcodes, quotes price, states availability windows, uses “we can…”, sends follow-up email, corrects details.
   Customer: confirms the business, describes the job, asks price/ETA, provides pickup/dropoff details, provides personal email, accepts or declines.
3) Control and commitment signals
   The party who quotes the price, proposes service windows, or promises to send a booking email is the agent. The party who evaluates the quote and provides details is the customer.
4) Tie breaker
   Prefer the mapping consistent with the CRM summary. If still ambiguous, choose as agent the participant who offers to email or uses company-insider language.

No outside knowledge. Ignore punctuation errors, partial words, and ASR artifacts. If there are more than two participants, choose the two with the most turns covering price, email, timing, and addresses. If one participant changes mid-call, pick the one who quotes price and sets the booking as agent.

Never add fields like confidence or explanations. Output must be minified JSON on one line.
`;

export const getJiminnyIdentificationPrompt = (
  callContext: string,
  transcript: string,
) => `
Task: Map participantId → role and return only {customerId, agentId} as a single JSON object.

Validation rules:
- Exactly two keys: customerId and agentId.
- Values must be participantId strings copied verbatim from the transcript.
- If uncertain, choose the best supported mapping per the policy in the system message. Do not return null and do not add extra keys.

Few-shot example (same format as the real input):

EXAMPLE_INPUT
CRM_CONTEXT:
{"createdAt":"2025-09-05T09:37:53.931Z","archived":false,"id":"88040465710","properties":{"hs_call_body":"Call initiated from null null to matthew.kershaw@anyvan.com ... \\"Sales rep offered to follow up via email to finalize the booking.\\" ... \\"Matthew Kershaw: Send an email to chris1708@sky.com\\""},"updatedAt":"2025-09-05T09:50:55.251Z"}

TRANSCRIPT:
[{"startsAt":1.6,"endsAt":2.88,"transcript":"Speaking of Matthew, how may I help you?","participantId":"bc72da87-cf03-4f08-9042-24b43d8a1c70"},
 {"startsAt":3.28,"endsAt":4.48,"transcript":"Is that AnyVan?","participantId":"f091826f-753b-4411-862d-76bb36bb74f4"},
 {"startsAt":179.87,"endsAt":182.11,"transcript":"Today because of Sport today it's 2, 2, 8.","participantId":"bc72da87-cf03-4f08-9042-24b43d8a1c70"},
 {"startsAt":194.49,"endsAt":196.5,"transcript":"I'll send you an email so you can finish it through there.","participantId":"bc72da87-cf03-4f08-9042-24b43d8a1c70"},
 {"startsAt":110.28,"endsAt":117.96,"transcript":"Yeah. Chris... sky.com.","participantId":"f091826f-753b-4411-862d-76bb36bb74f4"}]

EXAMPLE_OUTPUT
{"customerId":"f091826f-753b-4411-862d-76bb36bb74f4","agentId":"bc72da87-cf03-4f08-9042-24b43d8a1c70"}

Input
CRM_CONTEXT:
${callContext}

TRANSCRIPT:
${transcript}

Validation
- Ensure the output contains exactly two keys: customerId and agentId.
- Values must be participantId strings taken verbatim from the transcript.
- If you cannot determine roles with the above rules, choose the best supported mapping. Do not return null and do not add a confidence field.

Return only the JSON object. Do not include anything else.
`;
