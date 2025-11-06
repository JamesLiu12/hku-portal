<script lang="ts">
	import { searchBuildings, getBuildingByCode, type Building } from '$lib/data/mockBuildings';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	
	let { searchQuery = $bindable('') } = $props<{ searchQuery?: string }>();
	
	let selectedBuilding = $state<Building | null>(null);
	let fromBuilding = $state<Building | null>(null);
	let toBuilding = $state<Building | null>(null);
	let directions = $state<{ distance: number; time: number; steps: string[] } | null>(null);
	let mapContainer: HTMLDivElement;
	let mapImage: HTMLImageElement;
	let hoveredBuilding = $state<Building | null>(null);
	
	// Map image dimensions and positioning
	let mapImageRect = $state<{ x: number; y: number; width: number; height: number } | null>(null);
	
	const searchResults = $derived.by(() => searchQuery ? searchBuildings(searchQuery) : []);
	
	// Mock all buildings for map display
	import { mockBuildings } from '$lib/data/mockBuildings';
	const allBuildings = mockBuildings;
	
	// Calculate the actual rendered size and position of the map image
	function updateMapImageRect() {
		if (!browser || !mapContainer || !mapImage) return;
		
		const containerRect = mapContainer.getBoundingClientRect();
		const containerWidth = containerRect.width;
		const containerHeight = containerRect.height;
		
		// Get natural image dimensions
		const naturalWidth = mapImage.naturalWidth;
		const naturalHeight = mapImage.naturalHeight;
		
		if (naturalWidth === 0 || naturalHeight === 0) return;
		
		// Calculate scale to fit (object-contain behavior)
		const scaleX = containerWidth / naturalWidth;
		const scaleY = containerHeight / naturalHeight;
		const scale = Math.min(scaleX, scaleY);
		
		// Calculate actual rendered dimensions
		const renderedWidth = naturalWidth * scale;
		const renderedHeight = naturalHeight * scale;
		
		// Calculate centering offset
		const offsetX = (containerWidth - renderedWidth) / 2;
		const offsetY = (containerHeight - renderedHeight) / 2;
		
		mapImageRect = {
			x: offsetX,
			y: offsetY,
			width: renderedWidth,
			height: renderedHeight
		};
	}
	
	// Convert percentage coordinates to pixel positions relative to container
	function getPixelPosition(building: Building): { x: number; y: number } | null {
		if (!mapImageRect) return null;
		
		return {
			x: mapImageRect.x + (building.coordinates.x / 100) * mapImageRect.width,
			y: mapImageRect.y + (building.coordinates.y / 100) * mapImageRect.height
		};
	}
	
	// Handle window resize
	let resizeObserver: ResizeObserver;
	
	onMount(async () => {
		if (!browser) return;
		
		// Wait for next tick to ensure bindings are set
		await new Promise(resolve => setTimeout(resolve, 0));
		
		// Wait for image to load
		if (mapImage) {
			if (mapImage.complete && mapImage.naturalWidth > 0) {
				updateMapImageRect();
			} else {
				mapImage.addEventListener('load', updateMapImageRect, { once: true });
			}
		}
		
		// Observe container resize
		if (mapContainer) {
			resizeObserver = new ResizeObserver(() => {
				updateMapImageRect();
			});
			resizeObserver.observe(mapContainer);
		}
		
		// Also listen to window resize as fallback
		window.addEventListener('resize', updateMapImageRect);
	});
	
	onDestroy(() => {
		if (!browser) return;
		
		if (resizeObserver) {
			resizeObserver.disconnect();
		}
		window.removeEventListener('resize', updateMapImageRect);
		if (mapImage) {
			mapImage.removeEventListener('load', updateMapImageRect);
		}
	});
	
	function selectBuilding(building: Building) {
		selectedBuilding = building;
		searchQuery = building.code;
	}
	
	function calculateDirections() {
		if (!fromBuilding || !toBuilding) {
			directions = null;
			return;
		}
		
		const distance = Math.round(
			Math.sqrt(
				Math.pow(fromBuilding.coordinates.x - toBuilding.coordinates.x, 2) +
				Math.pow(fromBuilding.coordinates.y - toBuilding.coordinates.y, 2)
			) * 10 // Scale to approximate meters
		);
		
		const timeMinutes = Math.round(distance / 80); // ~80m per minute walking speed
		
		const steps = [
			`Start at ${fromBuilding.name} (${fromBuilding.code})`,
			`Head towards ${toBuilding.code} building`,
			`Continue for approximately ${Math.round(distance * 0.6)} meters`,
			`Arrive at ${toBuilding.name} (${toBuilding.code})`
		];
		
		directions = {
			distance,
			time: timeMinutes,
			steps
		};
	}
	
	function getBuildingTypeColor(type: Building['type']): string {
		switch (type) {
			case 'academic':
				return 'bg-blue-500';
			case 'library':
				return 'bg-purple-500';
			case 'dining':
				return 'bg-orange-500';
			case 'administrative':
				return 'bg-gray-600';
			case 'sports':
				return 'bg-green-500';
			default:
				return 'bg-gray-400';
		}
	}
	
	function getBuildingTypeIcon(type: Building['type']): string {
		switch (type) {
			case 'academic':
				return '🏫';
			case 'library':
				return '📚';
			case 'dining':
				return '🍽️';
			case 'administrative':
				return '🏛️';
			case 'sports':
				return '🏃';
			default:
				return '📍';
		}
	}
</script>

<div class="space-y-4">
	<!-- Search Results -->
	{#if searchResults.length > 0 && searchQuery}
		<div class="border border-gray-200 rounded-lg bg-white shadow-lg max-h-64 overflow-y-auto">
			<div class="divide-y divide-gray-200">
				{#each searchResults as building}
					<button
						type="button"
						onclick={() => selectBuilding(building)}
						class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
					>
						<div class="flex items-center gap-3">
							<span class="text-2xl">{getBuildingTypeIcon(building.type)}</span>
							<div class="flex-1">
								<div class="font-semibold text-gray-900">{building.name}</div>
								<div class="text-sm text-gray-600">{building.code} • {building.type}</div>
							</div>
						</div>
					</button>
				{/each}
			</div>
		</div>
	{/if}
	
	<!-- Map Container -->
	<div class="border border-gray-200 rounded-lg overflow-hidden bg-gray-50" style="height: 500px; position: relative;">
		<div 
			bind:this={mapContainer}
			class="w-full h-full relative"
		>
			<!-- HKU Map Background -->
			<img 
				bind:this={mapImage}
				src="/assets/hku-map.png" 
				alt="HKU Campus Map" 
				class="absolute inset-0 w-full h-full object-contain"
				style="background-color: #f9fafb;"
			/>
			
			<!-- Buildings as points on map -->
			{#each allBuildings as building}
				{@const isSelected = selectedBuilding?.id === building.id}
				{@const isHovered = hoveredBuilding?.id === building.id}
				{@const isFrom = fromBuilding?.id === building.id}
				{@const isTo = toBuilding?.id === building.id}
				{@const pos = getPixelPosition(building)}
				{#if pos}
					<button
						type="button"
						class="absolute transition-all duration-200 {getBuildingTypeColor(building.type)} 
							rounded-full shadow-lg hover:shadow-xl hover:scale-125 
							{(isSelected || isHovered) ? 'ring-4 ring-yellow-400 ring-opacity-50 z-30' : 'z-10'}
							{(isFrom || isTo) ? 'ring-4 ring-blue-400 ring-opacity-50' : ''}"
						style="left: {pos.x}px; top: {pos.y}px; transform: translate(-50%, -50%); width: {(isSelected || isHovered) ? '24px' : '16px'}; height: {(isSelected || isHovered) ? '24px' : '16px'};"
						onclick={() => selectBuilding(building)}
						onmouseenter={() => hoveredBuilding = building}
						onmouseleave={() => hoveredBuilding = null}
						title="{building.name} ({building.code})"
					>
					</button>
					
					<!-- Building label (show on hover or select) -->
					{#if isSelected || isHovered}
						<div
							class="absolute bg-white border border-gray-300 rounded-lg shadow-lg px-2 py-1 text-xs z-40 pointer-events-none whitespace-nowrap"
							style="left: {pos.x}px; top: {pos.y - 20}px; transform: translate(-50%, -100%);"
						>
							<div class="font-semibold text-gray-900">{building.code}</div>
							<div class="text-gray-600">{building.name}</div>
						</div>
					{/if}
				{/if}
			{/each}
			
			<!-- Direction line -->
			{#if fromBuilding && toBuilding && mapImageRect}
				{@const fromPos = getPixelPosition(fromBuilding)}
				{@const toPos = getPixelPosition(toBuilding)}
				{#if fromPos && toPos}
					<svg class="absolute inset-0 w-full h-full pointer-events-none z-5">
						<line
							x1="{fromPos.x}"
							y1="{fromPos.y}"
							x2="{toPos.x}"
							y2="{toPos.y}"
							stroke="#3b82f6"
							stroke-width="3"
							stroke-dasharray="5,5"
							marker-end="url(#arrowhead)"
						/>
						<defs>
							<marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
								<polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
							</marker>
						</defs>
					</svg>
				{/if}
			{/if}
			
			<!-- Legend -->
			<div class="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-xs z-50">
				<div class="font-semibold mb-2">Legend</div>
				<div class="space-y-1">
					<div class="flex items-center gap-2">
						<div class="w-3 h-3 rounded-full bg-blue-500"></div>
						<span>Academic</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-3 h-3 rounded-full bg-purple-500"></div>
						<span>Library</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-3 h-3 rounded-full bg-orange-500"></div>
						<span>Dining</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-3 h-3 rounded-full bg-gray-600"></div>
						<span>Administrative</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-3 h-3 rounded-full bg-green-500"></div>
						<span>Sports</span>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Selected Building Info Panel -->
	{#if selectedBuilding}
		<div class="card">
			<div class="flex items-start justify-between mb-3">
				<div class="flex items-center gap-3">
					<span class="text-3xl">{getBuildingTypeIcon(selectedBuilding.type)}</span>
					<div>
						<h3 class="font-semibold text-lg">{selectedBuilding.name}</h3>
						<p class="text-sm text-gray-600">{selectedBuilding.code} • {selectedBuilding.type}</p>
					</div>
				</div>
				<button
					type="button"
					onclick={() => selectedBuilding = null}
					class="text-gray-400 hover:text-gray-600"
				>
					✕
				</button>
			</div>
			
			{#if selectedBuilding.description}
				<p class="text-sm text-gray-700 mb-3">{selectedBuilding.description}</p>
			{/if}
			
			{#if selectedBuilding.facilities && selectedBuilding.facilities.length > 0}
				<div class="mb-3">
					<h4 class="text-sm font-semibold text-gray-900 mb-1">Facilities</h4>
					<div class="flex flex-wrap gap-2">
						{#each selectedBuilding.facilities as facility}
							<span class="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">{facility}</span>
						{/each}
					</div>
				</div>
			{/if}
			
			{#if selectedBuilding.operatingHours}
				<div class="mb-3">
					<h4 class="text-sm font-semibold text-gray-900 mb-1">Operating Hours</h4>
					<p class="text-sm text-gray-700">{selectedBuilding.operatingHours}</p>
				</div>
			{/if}
			
			<div class="flex gap-2 mt-4">
				<button
					type="button"
					onclick={() => {
						fromBuilding = selectedBuilding;
						if (toBuilding) calculateDirections();
					}}
					class="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded text-sm font-medium"
				>
					Set as From
				</button>
				<button
					type="button"
					onclick={() => {
						toBuilding = selectedBuilding;
						if (fromBuilding) calculateDirections();
					}}
					class="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded text-sm font-medium"
				>
					Set as To
				</button>
			</div>
		</div>
	{/if}
	
	<!-- Directions Panel -->
	<div class="card">
		<h3 class="font-semibold text-lg mb-4">Get Directions</h3>
		<div class="space-y-3">
			<div>
				<label for="directions-from" class="block text-sm font-medium text-gray-700 mb-1">From</label>
				<div class="flex items-center gap-2">
					<input
						id="directions-from"
						type="text"
						placeholder="Search or select building..."
						class="input flex-1"
						value={fromBuilding?.code || ''}
						readonly
					/>
					{#if fromBuilding}
						<button
							type="button"
							onclick={() => {
								fromBuilding = null;
								directions = null;
							}}
							class="text-red-600 hover:text-red-800"
							title="Clear"
						>
							✕
						</button>
					{/if}
				</div>
				{#if fromBuilding}
					<p class="text-xs text-gray-500 mt-1">{fromBuilding.name}</p>
				{/if}
			</div>
			<div>
				<label for="directions-to" class="block text-sm font-medium text-gray-700 mb-1">To</label>
				<div class="flex items-center gap-2">
					<input
						id="directions-to"
						type="text"
						placeholder="Search or select building..."
						class="input flex-1"
						value={toBuilding?.code || ''}
						readonly
					/>
					{#if toBuilding}
						<button
							type="button"
							onclick={() => {
								toBuilding = null;
								directions = null;
							}}
							class="text-red-600 hover:text-red-800"
							title="Clear"
						>
							✕
						</button>
					{/if}
				</div>
				{#if toBuilding}
					<p class="text-xs text-gray-500 mt-1">{toBuilding.name}</p>
				{/if}
			</div>
			<button
				type="button"
				onclick={calculateDirections}
				class="btn btn-primary w-full"
				disabled={!fromBuilding || !toBuilding}
			>
				Get Directions
			</button>
			
			{#if directions}
				<div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
					<div class="flex items-center justify-between mb-3">
						<div>
							<div class="text-sm font-semibold text-blue-900">
								Distance: {directions.distance} meters
							</div>
							<div class="text-sm text-blue-700">
								Estimated walking time: {directions.time} minute{directions.time !== 1 ? 's' : ''}
							</div>
						</div>
					</div>
					<div class="space-y-2 mt-3">
						<h4 class="text-sm font-semibold text-blue-900">Directions:</h4>
						{#each directions.steps as step, index}
							<div class="flex items-start gap-2 text-sm text-blue-800">
								<span class="font-semibold text-blue-600">{index + 1}.</span>
								<span>{step}</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
