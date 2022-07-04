<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/env';

	import flagsmith from "flagsmith/isomorphic"
	export let flagsmithState;
	if (browser && !flagsmith.initialised) {
		console.log("Initialising clientside Flagsmith with server state", flagsmithState)
		flagsmith.init({
			environmentID: "QjgYur4LQTwe5HpvbvhpzK",
			state: flagsmithState
		})
	}
</script>

<div class="counter">
	Font Size: <strong class="hidden" aria-hidden="true">{
		flagsmith.getValue("font_size")
	}</strong>
</div>

