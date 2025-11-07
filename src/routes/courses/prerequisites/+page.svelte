<script lang="ts">
	import CoursePrerequisiteTree from '$lib/components/CoursePrerequisiteTree.svelte';
	import CourseSearch from '$lib/components/CourseSearch.svelte';
	
	let selectedCourseCode = $state<string | null>(null);
	
	function handleCourseSelect(courseCode: string | null) {
		selectedCourseCode = courseCode;
	}
</script>

<svelte:head>
	<title>Course Prerequisites - HKU Helper</title>
</svelte:head>

<div class="space-y-6">
	<div class="card">
		<h1 class="text-2xl font-bold mb-6">Course Prerequisite Tree</h1>
		
		<p class="text-gray-600 mb-6">
			Search for a course to view its complete prerequisite tree with real-time eligibility checking.
		</p>
		
		<!-- Course Search -->
		<CourseSearch onSelect={handleCourseSelect} selectedCourse={selectedCourseCode} />
	</div>
	
	<!-- Prerequisite Tree Display -->
	{#if selectedCourseCode}
		<div class="card">
			<CoursePrerequisiteTree courseCode={selectedCourseCode} />
		</div>
	{:else}
		<div class="card">
			<div class="text-center py-12">
				<div class="text-6xl mb-4">🌳</div>
				<p class="text-gray-600 text-lg mb-2">No course selected</p>
				<p class="text-sm text-gray-500">
					Search for a course above or click one of the example courses to view its prerequisite tree
				</p>
			</div>
		</div>
	{/if}
</div>


