<script lang="ts">
	import QueueMonitor from '$lib/components/QueueMonitor.svelte';
</script>

<svelte:head>
	<title>Queue Times - Canteens - HKU Portal</title>
</svelte:head>

<div class="space-y-6">
	<div class="card">
		<h1 class="text-2xl font-bold mb-4">Canteen Queue Times</h1>
		<p class="text-gray-600 mb-6">
			Check real-time wait times at HKU canteens and find the best time to visit.
		</p>
		
		<QueueMonitor type="canteen" />
	</div>
</div>


