import { z } from "zod";

const serverSchema = z.object({
	D1_DB_ID: z.string().url(),
	CF_ACCOUNT_ID: z.string().url(),
	CF_API_TOKEN: z.string().url(),
});

const clientSchema = z.object({});

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
