<script lang="ts">
	import { EnvelopeIcon, LockIcon, RocketIcon, UserIcon } from "$lib/components/icons";
	import { Button } from "flowbite-svelte";
	import ProfileFrom from "./ProfileForm.svelte";
	import EmailForm from "./EmailForm.svelte";
	import PasswordForm from "./PasswordForm.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<div class="py-20">
	<!-- Account Page Header -->
	<div class="mx-auto flex max-w-2xl flex-col items-center pb-20 text-center">
		<span class="mt-2 text-5xl font-bold">Account Settings</span>
		<span class="text-neutral-content mt-4 text-center text-lg leading-8">
			Manage your email, password, billing, and other account details.
		</span>
	</div>
	<div
		class="divide-surface-700 mx-auto max-w-xl space-y-16 divide-y divide-gray-300 dark:divide-gray-700">
		<!-- Current Plan & Billing Section -->
		<section class="px-6">
			<div class="flex items-center font-semibold">
				<RocketIcon />
				<span class="ml-4">Current Plan & Billing</span>
			</div>
			<p class="mt-3 max-w-none text-sm">Manage your current plan and billing details</p>
			<div class="mt-8">
				<div>
					Current Plan: <strong>{data.tier}</strong>
				</div>
				<Button class="mt-4" href="/account/billing">Manage Billing</Button>
			</div>
		</section>
		<!-- Profile Section -->
		<ProfileFrom data={data.profileForm} />
		<!-- Email Address Section -->
		<EmailForm data={data.emailForm} />
		<!-- Change Password Section -->
		<PasswordForm data={data.passwordForm} />
	</div>
</div>
