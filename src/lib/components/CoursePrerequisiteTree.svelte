<script lang="ts">
	import type { PrerequisiteTree } from '$lib/types/course';
	
	let { courseCode } = $props<{ courseCode: string }>();
	
	// Mock data - would come from API
	let prerequisiteTree = $state<PrerequisiteTree | null>(null);
	
	// This would fetch from API in real implementation
	$effect(() => {
		if (courseCode) {
			// Simulate API call
			setTimeout(() => {
				prerequisiteTree = {
					course: {
						id: '1',
						code: courseCode,
						name: 'Sample Course',
						credits: 6,
						department: 'Computer Science',
						faculty: 'Engineering'
					},
					prerequisites: [],
					status: 'met'
				};
			}, 500);
		}
	});
</script>

{#if prerequisiteTree}
	<div class="mt-6">
		<div class="flex items-center justify-between mb-4">
			<div>
				<h2 class="text-xl font-bold">{prerequisiteTree.course.code}</h2>
				<p class="text-gray-600">{prerequisiteTree.course.name}</p>
			</div>
			<div
				class="px-4 py-2 rounded-lg {prerequisiteTree.status === 'met'
					? 'bg-green-100 text-green-800'
					: prerequisiteTree.status === 'partial'
						? 'bg-yellow-100 text-yellow-800'
						: 'bg-red-100 text-red-800'}"
			>
				{prerequisiteTree.status === 'met'
					? '✅ All Prerequisites Met'
					: prerequisiteTree.status === 'partial'
						? '⚠️ Partially Met'
						: '❌ Prerequisites Not Met'}
			</div>
		</div>
		
		<div class="border border-gray-200 rounded-lg p-6">
			<p class="text-sm text-gray-600 mb-4">
				Interactive prerequisite tree visualization will be displayed here.
				This will show the hierarchical structure of all course prerequisites.
			</p>
			
			{#if prerequisiteTree.prerequisites.length === 0}
				<p class="text-gray-500 italic">No prerequisites required for this course.</p>
			{/if}
		</div>
	</div>
{/if}


