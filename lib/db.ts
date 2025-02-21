import Cloudflare from "cloudflare";
import { env } from "@/lib/env";

const { CF_API_TOKEN, D1_DB_ID, CF_ACCOUNT_ID } = env.server;

const client = new Cloudflare({
	apiToken: CF_API_TOKEN
});


export async function dbQuery(sql: string) {
	const queryResult = await client.d1.database.query(D1_DB_ID, {
        account_id: CF_ACCOUNT_ID,
        sql: sql
    });

    console.log(queryResult)
    
    return queryResult.result
}
