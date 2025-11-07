<script lang="ts">
	import TimetableBuilder from '$lib/components/TimetableBuilder.svelte';
</script>

<svelte:head>
	<title>Timetable Builder - HKU Helper</title>
</svelte:head>

<div class="space-y-6">
	<div class="card">
		<h1 class="text-2xl font-bold mb-4">Timetable Builder</h1>
		<p class="text-gray-600 mb-6">
			Drag and drop courses to build your ideal timetable. Conflicts will be automatically detected.
		</p>
		
		<TimetableBuilder />
	</div>
</div>


