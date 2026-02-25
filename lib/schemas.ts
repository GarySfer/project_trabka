import { z } from "zod";

// ── Step 1: User Data ──
export const userDataSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z
    .string()
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    ),
});

// ── Step 2: HTTP Status Data ──
export const httpDataSchema = z
  .object({
    httpCode: z
      .string()
      .regex(/^[1-5]\d{2}$/, "Must be a valid HTTP status code (100-599)"),
    description: z
      .string()
      .min(3, "Description must be at least 3 characters")
      .max(200, "Description must be at most 200 characters"),
  })
  .refine(
    (data) => {
      const code = parseInt(data.httpCode, 10);
      return code >= 100 && code <= 599;
    },
    {
      message: "HTTP code must be between 100 and 599",
      path: ["httpCode"],
    }
  );

// ── Combined schema for the full form ──
export const multiStepFormSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters"),
    email: z
      .string()
      .regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address"
      ),
    httpCode: z
      .string()
      .regex(/^[1-5]\d{2}$/, "Must be a valid HTTP status code (100-599)"),
    description: z
      .string()
      .min(3, "Description must be at least 3 characters")
      .max(200, "Description must be at most 200 characters"),
    recaptchaToken: z.string().min(1, "Please complete the reCAPTCHA"),
  })
  .refine(
    (data) => {
      const code = parseInt(data.httpCode, 10);
      return code >= 100 && code <= 599;
    },
    {
      message: "HTTP code must be between 100 and 599",
      path: ["httpCode"],
    }
  );

// ── Search input schema ──
export const searchSchema = z.object({
  code: z
    .string()
    .regex(/^[1-5]\d{2}$/, "Enter a valid HTTP status code (100-599)"),
});

export type UserDataFormValues = z.infer<typeof userDataSchema>;
export type HttpDataFormValues = z.infer<typeof httpDataSchema>;
export type MultiStepFormValues = z.infer<typeof multiStepFormSchema>;
export type SearchFormValues = z.infer<typeof searchSchema>;
