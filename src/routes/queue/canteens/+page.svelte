<script lang="ts">
	import QueueMonitor from '$lib/components/QueueMonitor.svelte';
</script>

<svelte:head>
	<title>Queue Times - HKU Helper</title>
</svelte:head>

<div class="space-y-6">
	<!-- MTR Exit Status -->
	<div class="card">
		<h1 class="text-2xl font-bold mb-4">MTR Exit Status - HKU Station</h1>
		<p class="text-gray-600 mb-6">
			Check real-time crowd density and elevator/escalator availability at HKU Station exits.
		</p>
		
		<QueueMonitor type="mtr" />
	</div>
	
	<!-- Canteen Queue Times -->
	<div class="card">
		<h1 class="text-2xl font-bold mb-4">Canteen Queue Times</h1>
		<p class="text-gray-600 mb-6">
			Check real-time wait times at HKU canteens and find the best time to visit.
		</p>
		
		<QueueMonitor type="canteen" />
	</div>
</div>


