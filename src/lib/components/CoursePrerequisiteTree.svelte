<script lang="ts">
	import { getTree, getAvailableCourseCodes } from '$lib/data/mockPrerequisiteTrees';
	import type { SimpleTree } from '$lib/data/mockPrerequisiteTrees';
	import PrerequisiteTreeVisualization from './PrerequisiteTreeVisualization.svelte';
	
	let { courseCode } = $props<{ courseCode: string }>();

	const availableCourseCodes = getAvailableCourseCodes();
	
	let tree = $derived.by(() => {
		if (!courseCode) return null;
		return getTree(courseCode);
	});
	
	let loading = $state(false);
	let error = $state<string | null>(null);
	
	// Simulate loading
	$effect(() => {
		if (courseCode) {
			loading = true;
			setTimeout(() => {
				loading = false;
				if (!tree) {
					error = `Course ${courseCode} not found in prototype data`;
				} else {
					error = null;
				}
			}, 200);
		} else {
			loading = false;
			error = null;
		}
	});
</script>

{#if loading}
	<div class="mt-6 flex items-center justify-center py-12">
		<div class="text-center">
			<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-(--hku-green) mb-4"></div>
			<p class="text-gray-600">Loading prerequisite tree...</p>
		</div>
	</div>
{:else if error}
	<div class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
		<p class="text-red-800 font-semibold">Course Not Found</p>
		<p class="text-red-600 text-sm mt-1">{error}</p>
		<p class="text-red-600 text-xs mt-2">
			Available courses: {availableCourseCodes.join(', ')}
		</p>
	</div>
{:else if tree}
	<div class="mt-6 space-y-4">
		<!-- Course Header -->
		<div class="flex items-center justify-between mb-4">
			<div class="flex-1">
				<h2 class="text-2xl font-bold text-gray-900">{tree.courseCode}</h2>
				<p class="text-gray-600 mt-1">{tree.courseName}</p>
			</div>
			<div
				class="px-4 py-2 rounded-lg font-semibold {tree.status === 'completed'
					? 'bg-green-100 text-green-800'
					: tree.status === 'eligible'
						? 'bg-yellow-100 text-yellow-800'
						: 'bg-red-100 text-red-800'}"
			>
				{tree.status === 'completed'
					? '✅ Course Completed'
					: tree.status === 'eligible'
						? '⚑ Eligible to Enroll'
						: '❌ Requirements Outstanding'}
			</div>
		</div>
		
		<!-- Prerequisite Tree Visualization -->
		<div class="mt-4">
			<h3 class="text-lg font-semibold mb-4 text-gray-900">Prerequisite Tree</h3>
			{#if tree.prerequisites && Array.isArray(tree.prerequisites) && tree.prerequisites.length > 0}
				<PrerequisiteTreeVisualization {tree} />
			{:else}
				<div class="border border-gray-200 rounded-lg p-12 bg-gray-50 text-center">
					<p class="text-gray-500 text-lg">✅ No prerequisites required for this course</p>
					<p class="text-gray-400 text-sm mt-2">You can enroll directly!</p>
				</div>
			{/if}
		</div>
		
		<!-- Legend -->
		<div class="mt-4 p-4 bg-gray-100 rounded-lg">
			<h4 class="text-sm font-semibold mb-2">Legend</h4>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
				<div class="flex items-center gap-2">
					<span>✅</span>
					<span>Course completed</span>
				</div>
				<div class="flex items-center gap-2">
					<span>⚑</span>
					<span>Eligible to enroll (requirements satisfied)</span>
				</div>
				<div class="flex items-center gap-2">
					<span>❌</span>
					<span>Requirements not met</span>
				</div>
			</div>
		</div>
	</div>
{/if}
