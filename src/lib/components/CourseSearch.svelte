<script lang="ts">
	import { getAvailableCourseCodes } from '$lib/data/mockPrerequisiteTrees';
	
	let { onSelect, selectedCourse } = $props<{
		onSelect: (courseCode: string | null) => void;
		selectedCourse: string | null;
	}>();
	
	let searchQuery = $state('');
	let searchResults = $state<string[]>([]);
	let showResults = $state(false);
	
	let availableCourses = $derived.by(() => getAvailableCourseCodes());
	
	$effect(() => {
		if (searchQuery.length >= 2) {
			const query = searchQuery.toUpperCase();
			searchResults = availableCourses.filter(code => code.includes(query));
			showResults = true;
		} else {
			searchResults = [];
			showResults = false;
		}
	});
	
	function handleSelect(courseCode: string) {
		onSelect(courseCode);
		showResults = false;
		searchQuery = courseCode;
	}
	
	function handleClear() {
		searchQuery = '';
		onSelect(null);
		showResults = false;
	}
</script>

<div class="space-y-4">
	<div>
		<label for="course-search" class="block text-sm font-medium text-gray-700 mb-2">
			Search for a course
		</label>
		<input
			id="course-search"
			type="text"
			bind:value={searchQuery}
			onfocus={() => {
				if (searchQuery.length >= 2) showResults = true;
			}}
			placeholder="Enter course code (e.g., COMP3111, COMP3001)"
			class="input"
		/>
	</div>
	
	<!-- Search Results -->
	{#if showResults && searchResults.length > 0}
		<div class="border border-gray-200 rounded-lg bg-white shadow-lg max-h-96 overflow-y-auto">
			<div class="divide-y divide-gray-200">
				{#each searchResults as courseCode}
					<button
						type="button"
						onclick={() => handleSelect(courseCode)}
						class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
					>
						<div class="flex items-center justify-between">
							<div class="font-semibold text-gray-900">{courseCode}</div>
							<span class="text-gray-400">→</span>
						</div>
					</button>
				{/each}
			</div>
		</div>
	{:else if showResults && searchQuery.length >= 2 && searchResults.length === 0}
		<div class="border border-gray-200 rounded-lg bg-yellow-50 p-4">
			<p class="text-sm text-yellow-800">No courses found matching "{searchQuery}"</p>
			<p class="text-xs text-yellow-700 mt-1">Available courses: {availableCourses.join(', ')}</p>
		</div>
	{/if}
	
	<!-- Quick Select -->
	<div class="mt-4">
		<p class="text-sm text-gray-600 mb-2">Or select from examples:</p>
		<div class="flex flex-wrap gap-2">
			{#each availableCourses as courseCode}
				<button
					type="button"
					onclick={() => handleSelect(courseCode)}
					class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-[var(--hku-green)] hover:text-white rounded-lg transition-colors"
				>
					{courseCode}
				</button>
			{/each}
		</div>
	</div>
	
	<!-- Selected Course Display -->
	{#if selectedCourse}
		<div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
			<div class="flex items-center justify-between">
				<div>
					<div class="font-semibold text-blue-900">{selectedCourse}</div>
				</div>
				<button type="button" onclick={handleClear} class="text-blue-600 hover:text-blue-800">
					Clear
				</button>
			</div>
		</div>
	{/if}
</div>
