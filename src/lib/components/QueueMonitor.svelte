<script lang="ts">
	import type { QueueStatus, Canteen, MTRExitStatus, MTRExit } from '$lib/types/queue';
	
	let { type } = $props<{ type: 'canteen' | 'mtr' }>();
	
	// Mock data
	const canteens = $state<Array<Canteen & { queueStatus: QueueStatus }>>([]);
	const mtrExits = $state<Array<MTRExit & { status: MTRExitStatus }>>([]);
</script>

<div class="space-y-4">
	{#if type === 'canteen'}
		<!-- Canteen Queue Times -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each canteens.length > 0 ? canteens : [1, 2, 3] as canteen}
				<div class="card">
					<div class="flex items-start justify-between mb-2">
						<div>
							<h3 class="font-semibold text-lg">
								{typeof canteen === 'object' ? canteen.name : 'Sample Canteen'}
							</h3>
							<p class="text-sm text-gray-600">
								{typeof canteen === 'object' ? canteen.location : 'Main Campus'}
							</p>
						</div>
					</div>
					
					{#if typeof canteen === 'object' && canteen.queueStatus}
						<div class="mt-4 space-y-2">
							<div class="flex items-center justify-between">
								<span class="text-sm text-gray-600">Current Wait Time</span>
								<span class="font-semibold">{canteen.queueStatus.currentWaitTime} min</span>
							</div>
							<div class="flex items-center justify-between">
								<span class="text-sm text-gray-600">Capacity</span>
								<span
									class="px-2 py-1 rounded text-xs font-medium {canteen.queueStatus.capacity === 'low'
										? 'bg-green-100 text-green-800'
										: canteen.queueStatus.capacity === 'medium'
											? 'bg-yellow-100 text-yellow-800'
											: 'bg-red-100 text-red-800'}"
								>
									{canteen.queueStatus.capacity}
								</span>
							</div>
						</div>
					{:else}
						<div class="mt-4 text-center py-8 bg-gray-50 rounded-lg">
							<p class="text-sm text-gray-500">
								Canteen queue data will be displayed here when available.
							</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<!-- MTR Exit Status -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each mtrExits.length > 0 ? mtrExits : [1, 2] as exit}
				<div class="card">
					<h3 class="font-semibold text-lg mb-2">
						{typeof exit === 'object' ? exit.name : 'HKU Station - Exit A1'}
					</h3>
					{#if typeof exit === 'object' && exit.status}
						<div class="space-y-2 mt-4">
							<div class="flex items-center justify-between">
								<span class="text-sm text-gray-600">Crowd Density</span>
								<span
									class="px-2 py-1 rounded text-xs font-medium {exit.status.crowdDensity === 'low'
										? 'bg-green-100 text-green-800'
										: exit.status.crowdDensity === 'medium'
											? 'bg-yellow-100 text-yellow-800'
											: 'bg-red-100 text-red-800'}"
								>
									{exit.status.crowdDensity}
								</span>
							</div>
							<div class="flex items-center justify-between">
								<span class="text-sm text-gray-600">Elevator</span>
								<span class={exit.status.elevatorAvailable ? 'text-green-600' : 'text-red-600'}>
									{exit.status.elevatorAvailable ? '✓ Available' : '✗ Unavailable'}
								</span>
							</div>
						</div>
					{:else}
						<p class="text-sm text-gray-500 mt-4">
							MTR exit status will be displayed here when available.
						</p>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>


