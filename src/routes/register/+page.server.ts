import { z } from "zod";
import type { PageServerLoad } from "./$types";
import { setError, superValidate } from "sveltekit-superforms/server";
import { fail, type Actions, redirect } from "@sveltejs/kit";

const registerUserSchema = z.object({
	full_name: z.string().max(140, "Name must be 140 characters or less").nullish(),
	email: z.string().email("Invalid email address"),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters")
		.max(64, "Password must be 64 characters or less"),
	passwordConfirm: z
		.string()
		.min(6, "Password must be at least 6 characters")
		.max(64, "Password must be 64 characters or less")
});

export const load: PageServerLoad = async () => {
	return {
		form: superValidate(registerUserSchema)
	};
};

export const actions: Actions = {
	default: async (event) => {
		const session = await event.locals.getSession();
		// If the user is already logged in, redirect them to the home page
		if (session) {
			throw redirect(302, "/");
		}

		const form = await superValidate(event, registerUserSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		if (form.data.password !== form.data.passwordConfirm) {
			return setError(form, "passwordConfirm", "Passwords do not match!!");
		}

		const { error: authError } = await event.locals.supabase.auth.signUp({
			email: form.data.email,
			password: form.data.password,
			options: {
				data: {
					full_name: form.data.full_name ?? ""
				}
			}
		});

		if (authError) {
			return setError(form, null, "An error occurred while registering. Please try again later.");
		}
	}
};
