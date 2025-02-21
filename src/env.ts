import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  // Add other server-side only variables here
});

const clientSchema = z.object({
  NEXT_PUBLIC_SOME_KEY: z.string().optional(),
  // Add client-exposed variables here (must have NEXT_PUBLIC_ prefix)
});

const combinedSchema = z.intersection(serverSchema, clientSchema);
const parsedEnv = combinedSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables");
}

export const env = { 
  server: parsedEnv.data,
  client: Object.entries(parsedEnv.data)
    .filter(([key]) => key.startsWith("NEXT_PUBLIC_"))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
} as const;
