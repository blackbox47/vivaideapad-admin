import { z } from 'zod';

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required.')
    .max(255, 'Name must be at most 255 characters.'),
  icon: z.string().min(1, 'Icon is required.'),
  isActive: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
