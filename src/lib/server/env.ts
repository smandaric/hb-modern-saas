import * as dotenv from "dotenv";
dotenv.config();

function getEnvironmentVariable(key: string): string {
	const value = process.env[key];
	if (!value) {
		throw new Error(`Environment variable ${key} is not set`);
	}
	return value;
}

export const ENV = {
	PUBLIC_SUPABASE_ANON_KEY: getEnvironmentVariable("PUBLIC_SUPABASE_ANON_KEY"),
	PUBLIC_SUPABASE_URL: getEnvironmentVariable("PUBLIC_SUPABASE_URL"),
	SUPABASE_SERVICE_ROLE_KEY: getEnvironmentVariable("SUPABASE_SERVICE_ROLE_KEY"),
	SUPABASE_DB_URL: getEnvironmentVariable("SUPABASE_DB_URL")
};
