<script lang="ts">
	import QueueMonitor from '$lib/components/QueueMonitor.svelte';
</script>

<svelte:head>
	<title>Queue Times - MTR Exits - HKU Portal</title>
</svelte:head>

<div class="space-y-6">
	<div class="card">
		<h1 class="text-2xl font-bold mb-4">MTR Exit Status</h1>
		<p class="text-gray-600 mb-6">
			Check real-time crowd density and elevator/escalator availability at HKU Station exits.
		</p>
		
		<QueueMonitor type="mtr" />
	</div>
</div>


