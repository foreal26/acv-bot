<script>
	import { onMount } from "svelte"
	import Quote from "./Quote.svelte"
	import "@picocss/pico"
	let quotes = []

	onMount(async () => {
		const res = await fetch("https://tools.flowerpotprompts.com/quote", {
			headers: { Authorization: "Bearer 394ACFC13B25CE37EA89F02338A753E8A33FA5B654EF98ED26720E86CC6A6036" },
		})
		quotes = await res.json()
	})
</script>

<main class="container">
	<h1>Flowerpot Quotes</h1>

	{#each quotes as quote}
		<Quote {quote} />
	{/each}
</main>
