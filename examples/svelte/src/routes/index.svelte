
<script context="module" lang="ts">
	import { browser } from '$app/env';
	import App from '$lib/App.svelte';
	import flagsmith from 'flagsmith/isomorphic';
	export const hydrate = true;
	export const load = async ({ fetch, session }) => {
		console.log("Loading Value")
		const environmentID = "QjgYur4LQTwe5HpvbvhpzK";
		if(!browser) {
			await flagsmith.init({
				environmentID,
				enableLogs: true
			})
			session.flagsmithState = flagsmith.getState()
		}

		return {
			props: {
				flagsmithState: session.flagsmithState
			}
		};
	};

</script>

<script lang="ts">
	export let flagsmithState = "";
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<App flagsmithState={flagsmithState}/>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
