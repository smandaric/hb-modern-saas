import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { profileSchema, emailSchema, passwordSchema } from "$lib/schemas";

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.getSession();
	// If the user is already logged in, redirect them to the home page
	if (!session) {
		throw redirect(302, "/login");
	}

	async function getUserProfile() {
		const { error: profileError, data: profile } = await event.locals.supabase
			.from("profiles")
			.select("*")
			.limit(1)
			.single();

		if (profileError) {
			throw error(500, "An error occurred while fetching your profile. Please try again later.");
		}
		return profile;
	}

	return {
		profileForm: superValidate(await getUserProfile(), profileSchema, { id: "profile" }),
		emailForm: superValidate({ email: session.user.email }, emailSchema, { id: "email" }),
		passwordForm: superValidate(passwordSchema, { id: "password" })
	};
};
