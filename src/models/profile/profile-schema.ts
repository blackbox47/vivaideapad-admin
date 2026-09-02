import { z } from 'zod';

export const profileDetailsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Display name is required.')
    .max(120, 'Display name must be at most 120 characters.'),
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required.')
    .max(255, 'Email address must be at most 255 characters.')
    .email('Enter a valid email address.'),
  phone: z.string().max(40, 'Phone number must be at most 40 characters.'),
  bio: z.string().max(2000, 'Bio must be at most 2000 characters.'),
  publicDisplay: z.enum(['Public name', 'Pseudonymous']),
});

export type ProfileDetailsFormValues = z.infer<typeof profileDetailsSchema>;

export const passwordChangeSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .max(128, 'Password must be at most 128 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;
