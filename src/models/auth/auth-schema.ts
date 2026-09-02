import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .max(255, 'Email must be at most 255 characters')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const adminSignInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Admin email is required')
    .max(255, 'Email must be at most 255 characters')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type AdminSignInFormValues = z.infer<typeof adminSignInSchema>;
