<script lang="ts">
	let { searchQuery = $bindable('') } = $props<{ searchQuery?: string }>();
	
	const selectedBuilding = $state<string | null>(null);
</script>

<div class="space-y-4">
	<!-- Map Container -->
	<div class="border border-gray-200 rounded-lg overflow-hidden bg-gray-100" style="height: 500px;">
		<div class="h-full flex items-center justify-center">
			<div class="text-center">
				<p class="text-4xl mb-4">🗺️</p>
				<p class="text-gray-600 mb-2">Interactive Campus Map</p>
				<p class="text-sm text-gray-500">
					Map visualization with building search and directions will be displayed here.
					This will integrate with Google Maps or OpenStreetMap.
				</p>
			</div>
		</div>
	</div>
	
	<!-- Building Info Panel -->
	{#if selectedBuilding}
		<div class="card">
			<h3 class="font-semibold text-lg mb-2">Building Information</h3>
			<p class="text-sm text-gray-600">
				Building details and facilities will be shown here.
			</p>
		</div>
	{/if}
	
	<!-- Directions Panel -->
	<div class="card">
		<h3 class="font-semibold text-lg mb-4">Get Directions</h3>
		<div class="space-y-3">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">From</label>
				<input type="text" placeholder="Starting location" class="input" />
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">To</label>
				<input type="text" placeholder="Destination" class="input" />
			</div>
			<button class="btn btn-primary w-full">Get Directions</button>
		</div>
	</div>
</div>


