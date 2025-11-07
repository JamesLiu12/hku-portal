<script lang="ts">
	import CampusMap from '$lib/components/CampusMap.svelte';
	
	let searchQuery = $state('');
</script>

<svelte:head>
	<title>Campus Map - Helper</title>
</svelte:head>

<div class="space-y-6">
	<div class="card">
		<h1 class="text-2xl font-bold mb-4">Campus Map</h1>
		
		<div class="mb-4">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search for a building (e.g., KK, MB, Main Library)"
				class="input"
			/>
		</div>
		
		<CampusMap searchQuery={searchQuery} />
	</div>
</div>


