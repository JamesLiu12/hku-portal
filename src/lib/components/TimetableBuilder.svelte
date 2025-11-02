<script lang="ts">
	import type { CourseSection, TimeConflict } from '$lib/types/timetable';
	import { getSectionsByCourse, getAllCourseCodes, getSectionById } from '$lib/data/mockCourseSections';
	import { detectConflicts } from '$lib/utils/timetableConflicts';
	import TimetableGrid from './TimetableGrid.svelte';
	
	let timetableSections = $state<CourseSection[]>([]);
	let searchQuery = $state('');
	let selectedCourseCode = $state<string | null>(null);
	let availableSections = $state<CourseSection[]>([]);
	let showSectionPicker = $state(false);
	
	const days = [
		{ name: 'Sun', value: 0 },
		{ name: 'Mon', value: 1 },
		{ name: 'Tue', value: 2 },
		{ name: 'Wed', value: 3 },
		{ name: 'Thu', value: 4 },
		{ name: 'Fri', value: 5 },
		{ name: 'Sat', value: 6 }
	];
	
	const availableCourses = $derived.by(() => getAllCourseCodes());
	const filteredCourses = $derived.by(() => {
		if (!searchQuery) return [];
		const query = searchQuery.toUpperCase();
		return availableCourses.filter(code => code.includes(query));
	});
	
	const conflicts = $derived.by(() => detectConflicts(timetableSections));
	
	$effect(() => {
		if (selectedCourseCode) {
			availableSections = getSectionsByCourse(selectedCourseCode);
			showSectionPicker = true;
		}
	});
	
	function addSection(sectionId: string) {
		const section = getSectionById(sectionId);
		if (section && !timetableSections.find(s => s.id === sectionId)) {
			timetableSections = [...timetableSections, section];
			searchQuery = '';
			selectedCourseCode = null;
			showSectionPicker = false;
		}
	}
	
	function removeSection(sectionId: string) {
		timetableSections = timetableSections.filter(s => s.id !== sectionId);
	}
	
	function clearTimetable() {
		if (confirm('Clear all sections from your timetable?')) {
			timetableSections = [];
		}
	}
	
	function handleCourseSelect(courseCode: string) {
		selectedCourseCode = courseCode;
		searchQuery = courseCode;
	}
</script>

<div class="space-y-6">
	<!-- Conflict Warnings -->
	{#if conflicts.length > 0}
		<div class="space-y-3">
			{#each conflicts.filter(c => c.severity === 'error') as conflict}
				<div class="bg-red-50 border border-red-200 rounded-lg p-4">
					<div class="flex items-start gap-3">
						<span class="text-red-600 text-xl">❌</span>
						<div class="flex-1">
							<h3 class="font-semibold text-red-800 mb-1">Schedule Conflict</h3>
							<p class="text-sm text-red-700">{conflict.message}</p>
							<div class="mt-2 flex gap-2">
								<button
									type="button"
									onclick={() => removeSection(conflict.section1.id)}
									class="text-xs px-2 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded"
								>
									Remove {conflict.section1.courseCode} {conflict.section1.section}
								</button>
								<button
									type="button"
									onclick={() => removeSection(conflict.section2.id)}
									class="text-xs px-2 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded"
								>
									Remove {conflict.section2.courseCode} {conflict.section2.section}
								</button>
							</div>
						</div>
					</div>
				</div>
			{/each}
			
			{#each conflicts.filter(c => c.severity === 'warning') as conflict}
				<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
					<div class="flex items-start gap-3">
						<span class="text-yellow-600 text-xl">⚠️</span>
						<div class="flex-1">
							<h3 class="font-semibold text-yellow-800 mb-1">Time Warning</h3>
							<p class="text-sm text-yellow-700">{conflict.message}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
	
	<!-- Course Search and Selection -->
	<div class="card">
		<h2 class="text-xl font-semibold mb-4">Add Courses</h2>
		
		<div class="space-y-4">
			<!-- Search Input -->
			<div>
				<label for="course-search" class="block text-sm font-medium text-gray-700 mb-2">
					Search for a course
				</label>
				<input
					id="course-search"
					type="text"
					bind:value={searchQuery}
					placeholder="Enter course code (e.g., COMP3111, COMP3001)"
					class="input w-full"
					onfocus={() => {
						if (selectedCourseCode) {
							selectedCourseCode = null;
							showSectionPicker = false;
						}
					}}
				/>
			</div>
			
			<!-- Quick Select Buttons -->
			<div>
				<p class="text-sm text-gray-600 mb-2">Or select from available courses:</p>
				<div class="flex flex-wrap gap-2">
					{#each availableCourses as courseCode}
						<button
							type="button"
							onclick={() => handleCourseSelect(courseCode)}
							class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-[var(--hku-green)] hover:text-white rounded-lg transition-colors"
						>
							{courseCode}
						</button>
					{/each}
				</div>
			</div>
			
			<!-- Search Results -->
			{#if searchQuery.length >= 2 && !showSectionPicker}
				<div class="border border-gray-200 rounded-lg bg-white shadow-lg max-h-64 overflow-y-auto">
					{#if filteredCourses.length > 0}
						<div class="divide-y divide-gray-200">
							{#each filteredCourses as courseCode}
								<button
									type="button"
									onclick={() => handleCourseSelect(courseCode)}
									class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
								>
									<div class="font-semibold text-gray-900">{courseCode}</div>
								</button>
							{/each}
						</div>
					{:else}
						<div class="p-4 text-center text-gray-500 text-sm">
							No courses found matching "{searchQuery}"
						</div>
					{/if}
				</div>
			{/if}
			
			<!-- Section Picker -->
			{#if showSectionPicker && availableSections.length > 0}
				<div class="border border-gray-200 rounded-lg p-4 bg-blue-50">
					<h3 class="font-semibold text-gray-900 mb-3">
						Select sections for {selectedCourseCode}:
					</h3>
					<div class="space-y-2">
						{#each availableSections as section}
							{@const isAdded = timetableSections.find(s => s.id === section.id)}
							<div class="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
								<div class="flex-1">
									<div class="font-semibold text-gray-900">
										{section.section} - {section.type}
									</div>
									<div class="text-sm text-gray-600">
										{days[section.day].name} {section.startTime}-{section.endTime} • {section.venue} {section.building}
									</div>
									{#if section.instructor}
										<div class="text-xs text-gray-500 mt-1">Instructor: {section.instructor}</div>
									{/if}
									<div class="text-xs text-gray-500 mt-1">
										{section.enrolled}/{section.capacity} enrolled
										{#if section.waitlist}
											• {section.waitlist} on waitlist
										{/if}
									</div>
								</div>
								{#if isAdded}
									<span class="px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
										Added
									</span>
								{:else}
									<button
										type="button"
										onclick={() => addSection(section.id)}
										class="px-3 py-1 bg-[var(--hku-green)] text-white rounded text-sm font-medium hover:opacity-90"
									>
										Add
									</button>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
	
	<!-- Current Timetable Sections -->
	{#if timetableSections.length > 0}
		<div class="card">
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-xl font-semibold">Your Timetable</h2>
				<button
					type="button"
					onclick={clearTimetable}
					class="text-sm px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors"
				>
					Clear All
				</button>
			</div>
			
			<!-- Sections List -->
			<div class="mb-6 space-y-2">
				{#each timetableSections as section}
					<div class="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
						<div class="flex-1">
							<div class="font-semibold text-gray-900">
								{section.courseCode} - {section.courseName}
							</div>
							<div class="text-sm text-gray-600">
								{section.section} • {days[section.day].name} {section.startTime}-{section.endTime} • {section.venue} {section.building}
							</div>
						</div>
						<button
							type="button"
							onclick={() => removeSection(section.id)}
							class="text-red-600 hover:text-red-800 px-2"
							title="Remove section"
						>
							✕
						</button>
					</div>
				{/each}
			</div>
			
			<!-- Timetable Grid -->
			<TimetableGrid sections={timetableSections} />
		</div>
	{:else}
		<div class="card">
			<div class="text-center py-12">
				<div class="text-6xl mb-4">📅</div>
				<p class="text-gray-600 text-lg mb-2">No courses added yet</p>
				<p class="text-sm text-gray-500">
					Search for and add courses above to build your timetable
				</p>
			</div>
		</div>
	{/if}
	
	<!-- Actions -->
	{#if timetableSections.length > 0}
		<div class="flex justify-end gap-4">
			<button
				type="button"
				onclick={clearTimetable}
				class="btn btn-secondary"
			>
				Clear All
			</button>
			<button
				type="button"
				class="btn btn-primary"
				disabled={conflicts.filter(c => c.severity === 'error').length > 0}
				title={conflicts.filter(c => c.severity === 'error').length > 0 ? 'Please resolve conflicts before exporting' : ''}
			>
				Export to Calendar
			</button>
		</div>
	{/if}
</div>
