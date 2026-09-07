import { z } from 'zod';

import {
  BODY_MAX,
  SUMMARY_MAX,
  TITLE_MAX,
} from '@/models/creator/submit-idea-model';

export const URL_PATTERN = /^https?:\/\/\S+$/i;

export const submitIdeaSchema = z.object({
  topicId: z.string().min(1, 'Pick a topic before submitting.'),
  title: z
    .string()
    .trim()
    .min(1, 'Title is required.')
    .max(TITLE_MAX, `Title must be at most ${TITLE_MAX} characters.`),
  summary: z
    .string()
    .trim()
    .max(SUMMARY_MAX, `Summary must be at most ${SUMMARY_MAX} characters.`)
    .optional(),
  body: z
    .string()
    .trim()
    .min(1, 'Body is required.')
    .max(BODY_MAX, `Body must be at most ${BODY_MAX} characters.`),
  attachmentUrl: z.string().optional(),
  confirmedOriginal: z.boolean().refine((val) => val === true, {
    message: 'You must confirm that your submission is original and follows the content guidelines.',
  }),
});

export type SubmitIdeaFormValues = z.infer<typeof submitIdeaSchema>;
