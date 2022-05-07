<script lang="ts">
	import Submit from "./lib/icons/Submit.svelte"
	import Cancel from "./lib/icons/Cancel.svelte"
	export let author: string
	export let quote: string
	export let timestamp: string
	export let action: string
	export let disableDialog: () => void
	let password: string
	let res = ""

	const submit = async () => {
		const response = await fetch(`https://tools.flowerpotprompts.com/quote/${action}?timestamp=${timestamp}`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${password}`,
			},
			body: JSON.stringify({ author, quote, timestamp }),
		})
		if (response.status == 200) {
			res = "Success!"
		} else {
			res = "Something went wrong. Contact Foreal"
		}
	}
</script>

<dialog open>
	<article>
		{#if res}
			<h2>{res}</h2>
		{:else}
			<header>Enter password to make these changes</header>
			<input type="password" bind:value={password} />
		{/if}
		<div class="grid">
			<button class="outline" on:click={submit}>
				<Submit />
				<span>Send</span>
			</button>
			<button class="secondary outline" on:click={() => disableDialog()}>
				<Cancel />
				<span>Cancel</span>
			</button>
		</div>
	</article>
</dialog>
