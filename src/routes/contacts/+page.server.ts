import { error, fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { setError, superValidate } from "sveltekit-superforms/server";
import { createContactSchema, deleteContactSchema } from "$lib/schemas";
import { supabaseAdmin } from "$lib/server/supabase-admin";
import { getSubscriptionTier } from "$lib/server/subscriptions";
import { getContactsCount } from "$lib/server/contacts";
import { hasReachedMaxContacts } from "$lib/helpers";

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.getSession();
	if (!session) {
		throw redirect(302, "/login");
	}

	async function getContacts() {
		const { data: contacts, error: contactsError } = await event.locals.supabase
			.from("contacts")
			.select("*")
			.limit(10);

		if (contactsError) {
			return error(500, "Error fetching contacts. Please try again later.");
		}

		return contacts;
	}

	return {
		createContactForm: superValidate(createContactSchema, { id: "create" }),
		deleteContactForm: superValidate(deleteContactSchema, { id: "delete" }),
		contacts: getContacts(),
		tier: getSubscriptionTier(session.user.id),
		contactsCount: getContactsCount(session.user.id)
	};
};

export const actions: Actions = {
	createContact: async (event) => {
		const session = await event.locals.getSession();
		if (!session) {
			throw error(401, "Unauthorized");
		}

		const [tier, count, createContactForm] = await Promise.all([
			getSubscriptionTier(session.user.id),
			getContactsCount(session.user.id),
			superValidate(event, createContactSchema, {
				id: "create"
			})
		]);

		// We will limit this in the UI, but it's good to have a check here as well
		if (hasReachedMaxContacts(tier, count)) {
			throw error(
				403,
				"You have reached the max number of contacts for your tier. Please upgrade."
			);
		}

		if (!createContactForm.valid) {
			return fail(400, { createContactForm });
		}

		const { error: createContactError } = await supabaseAdmin.from("contacts").insert({
			...createContactForm.data,
			user_id: session.user.id
		});

		if (createContactError) {
			console.log(createContactError);
			return setError(createContactForm, null, "Error creating contact.");
		}

		return {
			createContactForm
		};
	},
	deleteContact: async (event) => {
		const session = await event.locals.getSession();
		if (!session) {
			throw error(401, "Unauthorized");
		}

		// This is how you can validate a URL parameter
		// The URL parameter contains ID of the contact to delete
		const deleteContactForm = await superValidate(event.url, deleteContactSchema, { id: "delete" });

		if (!deleteContactForm.valid) {
			return fail(400, { deleteContactForm });
		}

		const { error: deleteContactError } = await supabaseAdmin
			.from("contacts")
			.delete()
			.eq("id", deleteContactForm.data.id);

		if (deleteContactError) {
			return setError(deleteContactForm, null, "Error deleting contact.");
		}

		return {
			deleteContactForm
		};
	}
};
