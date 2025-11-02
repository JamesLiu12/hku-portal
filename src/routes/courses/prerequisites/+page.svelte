<script lang="ts">
	import CoursePrerequisiteTree from '$lib/components/CoursePrerequisiteTree.svelte';
	
	// Mock course data
	let selectedCourse = $state<string | null>(null);
	let searchQuery = $state('');
</script>

<svelte:head>
	<title>Course Prerequisites - HKU Portal</title>
</svelte:head>

<div class="space-y-6">
	<div class="card">
		<h1 class="text-2xl font-bold mb-4">Course Prerequisite Tree</h1>
		
		<div class="mb-4">
			<label for="course-search" class="block text-sm font-medium text-gray-700 mb-2">
				Search for a course
			</label>
			<input
				id="course-search"
				type="text"
				bind:value={searchQuery}
				placeholder="Enter course code (e.g., COMP1111) or name"
				class="input"
			/>
		</div>
		
		{#if searchQuery && !selectedCourse}
			<div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
				<p class="text-sm text-gray-600">
					Search results would appear here. Click on a course to view its prerequisite tree.
				</p>
			</div>
		{/if}
		
		{#if selectedCourse}
			<CoursePrerequisiteTree courseCode={selectedCourse} />
		{:else}
			<div class="mt-8 text-center py-12 bg-gray-50 rounded-lg">
				<p class="text-gray-600 mb-4">Search for a course to view its prerequisite tree</p>
				<p class="text-sm text-gray-500">
					This feature will show all course prerequisites in an interactive tree format
				</p>
			</div>
		{/if}
	</div>
</div>


