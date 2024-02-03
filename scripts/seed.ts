import { clearSupabaseData, createUser, startSupabase, createContact } from "./utils";

async function seed() {
	try {
		await startSupabase();
		await clearSupabaseData();
		const user = await createUser({
			email: "t@t.com",
			full_name: "Test user",
			password: "password"
		});

		for (let i = 0; i < 5; i++) {
			await createContact(user.id);
		}

		console.log("Seeded sucessfully");
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
	process.exit();
}
seed();
