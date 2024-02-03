import { error, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async (event) => {
	const { error: logoutError } = await event.locals.supabase.auth.signOut();

	if (logoutError) {
		throw error(500, "An error occurred while logging out. Please try again later.");
	}

	throw redirect(302, "/login");
};
