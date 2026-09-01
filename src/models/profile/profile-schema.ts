import { z } from 'zod';

export const profileDetailsSchema = z.object({
  name: z.string().trim().min(1, 'Display name is required.'),
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required.')
    .email('Enter a valid email address.'),
  phone: z.string(),
  bio: z.string(),
  publicDisplay: z.enum(['Public name', 'Pseudonymous']),
});

export type ProfileDetailsFormValues = z.infer<typeof profileDetailsSchema>;

export const passwordChangeSchema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;
