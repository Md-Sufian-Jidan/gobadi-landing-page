import { z } from "zod";

export const contactSchema = z.object({
    email: z.string().min(1, "Email is required").email("Please enter a valid email"),
    message: z
        .string()
        .min(5, "Message must be at least 5 characters")
        .max(2000, "Message must be 2000 characters or fewer"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
