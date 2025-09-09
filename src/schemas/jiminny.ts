import { z } from 'zod';
import { nullishObject } from './utils';

export const JiminnyActivitiesSchema = z.object({
  results: z.array(
    z.object({
      participants: z.array(
        nullishObject({
          id: z.string(),
          user: nullishObject({
            teamName: z.string().nullable(),
          }),
        }),
      ),
    }),
  ),
});

export const JiminnyTranscriptSchema = z.array(
  z.object({
    startsAt: z.number(),
    endsAt: z.number(),
    transcript: z.string(),
    participantId: z.string(),
  }),
);
