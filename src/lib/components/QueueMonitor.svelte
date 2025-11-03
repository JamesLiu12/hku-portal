<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Canteen, QueueStatus, MTRExit, MTRExitStatus } from '$lib/types/queue';
	import {
		getCanteenQueueStatuses,
		getMTRExitStatuses,
		getPeakHours,
		estimateFutureWaitTime,
		mockCanteens,
		mockMTRExits
	} from '$lib/data/mockQueueData';
	
	let { type } = $props<{ type: 'canteen' | 'mtr' }>();
	
	let canteens = $state<Array<Canteen & { queueStatus: QueueStatus }>>([]);
	let mtrExits = $state<Array<MTRExit & { status: MTRExitStatus }>>([]);
	let searchQuery = $state('');
	let locationFilter = $state<string>('all');
	let dietaryFilter = $state<string>('all');
	let refreshInterval: ReturnType<typeof setInterval> | null = null;
	let selectedCanteen = $state<(Canteen & { queueStatus: QueueStatus }) | null>(null);
	let targetTime = $state({ hour: 12, minute: 30 });
	
	const peakHours = getPeakHours();
	
	const filteredCanteens = $derived.by(() => {
		let filtered = [...canteens];
		
		// Search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				c =>
					c.name.toLowerCase().includes(query) ||
					c.building.toLowerCase().includes(query) ||
					c.location.toLowerCase().includes(query) ||
					c.cuisines?.some(cuisine => cuisine.toLowerCase().includes(query))
			);
		}
		
		// Location filter
		if (locationFilter !== 'all') {
			filtered = filtered.filter(c => c.location === locationFilter);
		}
		
		// Dietary filter
		if (dietaryFilter !== 'all') {
			filtered = filtered.filter(
				c => c.dietaryOptions?.includes(dietaryFilter as 'vegetarian' | 'halal' | 'vegan')
			);
		}
		
		return filtered;
	});
	
	const locations = $derived.by(() => {
		const locs = new Set(canteens.map(c => c.location));
		return Array.from(locs);
	});
	
	function loadData() {
		if (type === 'canteen') {
			canteens = getCanteenQueueStatuses();
		} else {
			mtrExits = getMTRExitStatuses();
		}
	}
	
	function getCapacityColor(capacity: string): string {
		switch (capacity) {
			case 'low':
				return 'bg-green-100 text-green-800 border-green-300';
			case 'medium':
				return 'bg-yellow-100 text-yellow-800 border-yellow-300';
			case 'high':
				return 'bg-orange-100 text-orange-800 border-orange-300';
			case 'full':
				return 'bg-red-100 text-red-800 border-red-300';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-300';
		}
	}
	
	function getCrowdDensityColor(density: string): string {
		switch (density) {
			case 'low':
				return 'bg-green-100 text-green-800 border-green-300';
			case 'medium':
				return 'bg-yellow-100 text-yellow-800 border-yellow-300';
			case 'high':
				return 'bg-red-100 text-red-800 border-red-300';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-300';
		}
	}
	
	function formatTime(date: Date): string {
		return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
	}
	
	function getOperatingHours(canteen: Canteen): string {
		const day = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][
			new Date().getDay()
		];
		const hours = canteen.operatingHours[day];
		if (!hours) return 'Closed today';
		return `${hours.open} - ${hours.close}`;
	}
	
	function getEstimatedWaitForTime(canteenId: string): number {
		return estimateFutureWaitTime(canteenId, targetTime.hour, targetTime.minute);
	}
	
	onMount(() => {
		loadData();
		// Auto-refresh every 30 seconds
		refreshInterval = setInterval(() => {
			loadData();
		}, 30000);
	});
	
	onDestroy(() => {
		if (refreshInterval) {
			clearInterval(refreshInterval);
		}
	});
</script>

<div class="space-y-4">
	{#if type === 'canteen'}
		<!-- Filters -->
		<div class="card">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div>
					<label for="search-canteen" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
					<input
						id="search-canteen"
						type="text"
						bind:value={searchQuery}
						placeholder="Search canteens..."
						class="input"
					/>
				</div>
				<div>
					<label for="location-filter" class="block text-sm font-medium text-gray-700 mb-1">Location</label>
					<select id="location-filter" bind:value={locationFilter} class="input">
						<option value="all">All Locations</option>
						{#each locations as location}
							<option value={location}>{location}</option>
						{/each}
					</select>
				</div>
				<div>
					<label for="dietary-filter" class="block text-sm font-medium text-gray-700 mb-1">Dietary</label>
					<select id="dietary-filter" bind:value={dietaryFilter} class="input">
						<option value="all">All Options</option>
						<option value="vegetarian">Vegetarian</option>
						<option value="halal">Halal</option>
						<option value="vegan">Vegan</option>
					</select>
				</div>
			</div>
		</div>
		
		<!-- Peak Hours Info -->
		<div class="card bg-blue-50 border-blue-200">
			<h3 class="font-semibold text-blue-900 mb-2">Peak Hours</h3>
			<div class="flex flex-wrap gap-4 text-sm">
				{#each peakHours as peak}
					<div class="flex items-center gap-2">
						<span class="text-blue-700">{peak.description}:</span>
						<span class="font-medium text-blue-900">{peak.start} - {peak.end}</span>
					</div>
				{/each}
			</div>
		</div>
		
		<!-- Canteen Cards -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each filteredCanteens as canteen}
				<button
					type="button"
					class="card cursor-pointer hover:shadow-lg transition-shadow border-2 text-left {selectedCanteen?.id === canteen.id
						? 'border-[var(--hku-green)]'
						: 'border-transparent'}"
					onclick={() => selectedCanteen = selectedCanteen?.id === canteen.id ? null : canteen}
				>
					<div class="flex items-start justify-between mb-2">
						<div class="flex-1">
							<h3 class="font-semibold text-lg">{canteen.name}</h3>
							<p class="text-sm text-gray-600">{canteen.building} • {canteen.location}</p>
						</div>
						<span class="text-gray-400">
							{selectedCanteen?.id === canteen.id ? '▼' : '▶'}
						</span>
					</div>
					
					<!-- Queue Status -->
					<div class="mt-4 space-y-2">
						<div class="flex items-center justify-between p-2 bg-gray-50 rounded">
							<span class="text-sm text-gray-600">Current Wait</span>
							<span class="font-semibold text-lg">{canteen.queueStatus.currentWaitTime} min</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-sm text-gray-600">Capacity</span>
							<span
								class="px-2 py-1 rounded text-xs font-medium border {getCapacityColor(canteen.queueStatus.capacity)}"
							>
								{canteen.queueStatus.capacity.toUpperCase()}
							</span>
						</div>
						<div class="flex items-center justify-between text-xs text-gray-500">
							<span>Last updated: {formatTime(canteen.queueStatus.lastUpdated)}</span>
							<span>{canteen.queueStatus.dataPoints} reports</span>
						</div>
					</div>
					
					<!-- Operating Hours -->
					<div class="mt-3 pt-3 border-t border-gray-200">
						<p class="text-xs text-gray-600">
							<span class="font-medium">Hours:</span> {getOperatingHours(canteen)}
						</p>
					</div>
					
					<!-- Cuisines & Dietary Options -->
					{#if canteen.cuisines || canteen.dietaryOptions}
						<div class="mt-3 pt-3 border-t border-gray-200">
							{#if canteen.cuisines}
								<div class="flex flex-wrap gap-1 mb-2">
									{#each canteen.cuisines as cuisine}
										<span class="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">{cuisine}</span>
									{/each}
								</div>
							{/if}
							{#if canteen.dietaryOptions}
								<div class="flex flex-wrap gap-1">
									{#each canteen.dietaryOptions as option}
										<span
											class="px-2 py-0.5 bg-green-100 text-xs rounded text-green-700 font-medium"
										>{option}</span>
									{/each}
								</div>
							{/if}
						</div>
					{/if}
				</button>
			{/each}
		</div>
		
		{#if filteredCanteens.length === 0}
			<div class="card text-center py-8">
				<p class="text-gray-500">No canteens found matching your filters.</p>
			</div>
		{/if}
		
		<!-- Detailed Canteen View -->
		{#if selectedCanteen}
			<div class="card">
				<div class="flex items-start justify-between mb-4">
					<div>
						<h2 class="text-2xl font-bold">{selectedCanteen.name}</h2>
						<p class="text-gray-600">{selectedCanteen.building} • {selectedCanteen.location}</p>
					</div>
					<button
						type="button"
						onclick={() => selectedCanteen = null}
						class="text-gray-400 hover:text-gray-600"
					>
						✕
					</button>
				</div>
				
				<!-- Estimated Wait for Specific Time -->
				<div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
					<h3 class="font-semibold text-blue-900 mb-3">Estimate Wait Time</h3>
					<div class="flex items-end gap-4">
						<div class="flex-1">
							<label for="target-hour" class="block text-sm font-medium text-gray-700 mb-1">Time</label>
							<div class="flex gap-2">
								<input
									id="target-hour"
									type="number"
									min="0"
									max="23"
									bind:value={targetTime.hour}
									class="input"
									style="width: 80px;"
								/>
								<span class="self-center">:</span>
								<input
									id="target-minute"
									type="number"
									min="0"
									max="59"
									step="5"
									bind:value={targetTime.minute}
									class="input"
									style="width: 80px;"
								/>
							</div>
						</div>
						<div class="text-center">
							<div class="text-sm text-gray-600 mb-1">Estimated Wait</div>
							<div class="text-2xl font-bold text-blue-900">
								{getEstimatedWaitForTime(selectedCanteen.id)} min
							</div>
						</div>
					</div>
				</div>
				
				<!-- Current Status -->
				<div class="grid grid-cols-2 gap-4 mb-4">
					<div class="p-4 bg-gray-50 rounded-lg">
						<div class="text-sm text-gray-600 mb-1">Current Wait Time</div>
						<div class="text-2xl font-bold">{selectedCanteen.queueStatus.currentWaitTime} min</div>
					</div>
					<div class="p-4 bg-gray-50 rounded-lg">
						<div class="text-sm text-gray-600 mb-1">Capacity</div>
						<div
							class="inline-block px-3 py-1 rounded text-sm font-medium border {getCapacityColor(selectedCanteen.queueStatus.capacity)}"
						>
							{selectedCanteen.queueStatus.capacity.toUpperCase()}
						</div>
					</div>
				</div>
				
				<!-- Operating Hours Table -->
				<div class="mb-4">
					<h3 class="font-semibold mb-2">Operating Hours</h3>
					<div class="overflow-x-auto">
						<table class="w-full text-sm">
							<thead>
								<tr class="border-b border-gray-200">
									<th class="text-left py-2 px-3">Day</th>
									<th class="text-left py-2 px-3">Hours</th>
								</tr>
							</thead>
							<tbody>
								{#each Object.entries(selectedCanteen.operatingHours) as [day, hours]}
									<tr class="border-b border-gray-100">
										<td class="py-2 px-3 font-medium capitalize">{day}</td>
										<td class="py-2 px-3">{hours.open} - {hours.close}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		{/if}
	{:else}
		<!-- MTR Exit Status -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each mtrExits as exit}
				<div class="card">
					<div class="flex items-start justify-between mb-2">
						<div>
							<h3 class="font-semibold text-lg">{exit.name}</h3>
							<p class="text-sm text-gray-600">{exit.station}</p>
						</div>
					</div>
					
					{#if exit.status}
						<div class="mt-4 space-y-3">
							<div class="flex items-center justify-between p-2 bg-gray-50 rounded">
								<span class="text-sm text-gray-600">Estimated Queue Time</span>
								<span class="font-semibold text-lg">{exit.status.estimatedQueueTime} min</span>
							</div>
							
							<div class="flex items-center justify-between">
								<span class="text-sm text-gray-600">Crowd Density</span>
								<span
									class="px-3 py-1 rounded text-xs font-medium border {getCrowdDensityColor(exit.status.crowdDensity)}"
								>
									{exit.status.crowdDensity.toUpperCase()}
								</span>
							</div>
							
							<div class="pt-2 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
								<span>Last updated: {formatTime(exit.status.lastUpdated)}</span>
								<span>{exit.status.dataPoints} reports</span>
							</div>
						</div>
					{:else}
						<p class="text-sm text-gray-500 mt-4">Status data unavailable</p>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

