<script lang="ts">
	import Edit from "./lib/icons/Edit.svelte"
	import Delete from "./lib/icons/Delete.svelte"
	import Cancel from "./lib/icons/Cancel.svelte"
	import Dialog from "./Dialog.svelte"
	import type { DialogProps } from "./lib/types/dialog"
	export let quote
	let dialogProps: DialogProps | { active: false } = { active: false }
	let editMode = false
</script>

{#if dialogProps.active}
	<Dialog {...dialogProps} />
{/if}
{#if editMode}
	<article>
		<header>
			<input type="text" bind:value={quote.author} />
		</header>
		<textarea rows={quote.quote.split(/\r\n|\r|\n/).length * 2} bind:value={quote.quote} />
		<input type="text" bind:value={quote.link} />
		<div class="grid">
			<button
				class="outline"
				on:click={() => {
					dialogProps = {
						...quote,
						action: "edit",
						active: true,
						disableDialog: () => (dialogProps = { active: false }),
					}
				}}
			>
				<Edit />
				<span>Confirm</span>
			</button>
			<button class="secondary outline" on:click={() => (editMode = false)}>
				<Cancel />
				<span>Cancel</span>
			</button>
		</div>
	</article>
{:else}
	<article>
		<header>{quote.author}</header>
		<pre>{quote.quote}</pre>
		<a href={quote.link}>{quote.link}</a>
		<div class="grid">
			<button
				class="outline"
				on:click={() => {
					editMode = true
				}}
			>
				<Edit />
				<span>Edit</span>
			</button>
			<button
				class="secondary outline"
				on:click={() => {
					dialogProps = {
						...quote,
						action: "delete",
						active: true,
						disableDialog: () => (dialogProps = { active: false }),
					}
				}}
			>
				<Delete />
				<span>Delete</span>
			</button>
		</div>
	</article>
{/if}

<style>
	pre {
		white-space: pre-wrap; /* Since CSS 2.1 */
		white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
		white-space: -pre-wrap; /* Opera 4-6 */
		white-space: -o-pre-wrap; /* Opera 7 */
		word-wrap: break-word; /* Internet Explorer 5.5+ */
		background-color: var(--background-color);
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue",
			sans-serif;
	}
</style>
