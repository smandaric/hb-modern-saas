import {
	clearSupabaseData,
	createUser,
	startSupabase,
	createContact,
	syncStripeProducts
} from "./utils";

const testUsers = [
	{
		full_name: "Test User 1",
		email: "t1@t.com",
		password: "password"
	},
	{
		full_name: "Test User 2",
		email: "t2@t.com",
		password: "password"
	},
	{
		full_name: "Test User 3",
		email: "t3@t.com",
		password: "password"
	}
];

async function seed() {
	try {
		await startSupabase();
		await clearSupabaseData();
		await syncStripeProducts();

		for (const testUser of testUsers) {
			const user = await createUser(testUser);
			for (let i = 0; i < 4; i++) {
				await createContact(user.id);
			}
		}

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
