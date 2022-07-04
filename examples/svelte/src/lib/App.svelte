<script lang="ts">
	import { browser } from '$app/env';
	import flagsmith from "flagsmith/isomorphic"
	export let flagsmithState;

	const updateFeatures = ()=> { // update the state when flags are changed
		fontSize = flagsmith.getValue("font_size");
		loggedIn = !!flagsmith.identity;
	}


	if (browser && !flagsmith.initialised) {
		console.log("Initialising clientside Flagsmith with server state", flagsmithState)
		flagsmith.init({
			environmentID: "QjgYur4LQTwe5HpvbvhpzK",
			state: flagsmithState,
			onChange: updateFeatures
		})
	}

	let loggedIn = !!flagsmith.identity;
	let fontSize = flagsmith.getValue("font_size");

	function login () {
		flagsmith.identify("flagsmith_sample_user")
	}

	function logout () {
		flagsmith.logout()
	}
</script>

<div class="counter">
	<div>
		Font Size: <strong class="hidden" aria-hidden="true">{
		fontSize
	}</strong>
	</div>
	{#if !loggedIn}
		<button on:click={login}>
			Log in
		</button>
	{/if}
	{#if loggedIn}
		<div>
			Example Trait: <strong className='hidden' aria-hidden='true'>{
			flagsmith.getTrait("example_trait")
		}</strong>
		</div>
		<button on:click={logout}>
			Logout
		</button>
	{/if}

</div>

