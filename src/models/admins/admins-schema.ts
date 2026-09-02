import { z } from 'zod';

export const addAdminSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required.')
    .max(120, 'Name must be at most 120 characters.'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .max(255, 'Email must be at most 255 characters.')
    .email('Enter a valid email address.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(128, 'Password must be at most 128 characters.'),
});

export type AddAdminFormValues = z.infer<typeof addAdminSchema>;
