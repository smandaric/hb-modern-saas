import { clearSupabaseData, createUser, startSupabase } from "./utils";

async function seed() {
	try {
		await startSupabase();
		await clearSupabaseData();
		await createUser({ email: "t@t.com", full_name: "Test user", password: "password" });
		console.log("Seeded sucessfully");
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
	process.exit();
}
seed();
