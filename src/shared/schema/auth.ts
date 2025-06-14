import { z } from "zod/v4";

export const AuthMethodSchema = z.object({
  providerId: z.string(),
  providerType: z.string(),
  name: z.string(),
  icon: z.string(),
});

export type AuthMethod = z.infer<typeof AuthMethodSchema>;
