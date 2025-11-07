<script lang="ts">
	import { page } from '$app/stores';
	
	let { showNotifications = $bindable(false) } = $props();
	
	const navItems = [
		{ path: '/', label: 'Home', icon: '🏠' },
		{ path: '/courses/prerequisites', label: 'Course Prerequisites', icon: '📚' },
		{ path: '/timetable/builder', label: 'Timetable Builder', icon: '📅' },
		{ path: '/map', label: 'Campus Map', icon: '🗺️' },
		{ path: '/queue/canteens', label: 'Queue Times', icon: '⏱️' },
		{ path: '/alerts', label: 'Alerts', icon: '🔔' }
	];
	
	function isActive(path: string): boolean {
		return $page.url.pathname === path || $page.url.pathname.startsWith(path + '/');
	}
</script>

<nav class="bg-white shadow-md border-b border-gray-200">
	<div class="container mx-auto px-4">
		<div class="flex items-center justify-between h-16">
			<!-- Logo and Title -->
			<div class="flex items-center space-x-4">
				<div class="text-2xl font-bold text-[var(--hku-green)]">
					HKU Helper
				</div>
				<div class="text-sm text-gray-600">
					The University of Hong Kong
				</div>
			</div>
			
			<!-- Navigation Items -->
			<div class="hidden md:flex items-center space-x-1">
				{#each navItems as item}
					<a
						href={item.path}
						class="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 {isActive(item.path)
							? 'bg-[var(--hku-green)] text-white'
							: 'text-gray-700 hover:bg-gray-100'}"
					>
						<span class="mr-2">{item.icon}</span>
						{item.label}
					</a>
				{/each}
			</div>
			
			<!-- Right Side Actions -->
			<div class="flex items-center space-x-4">
				<button
					onclick={() => showNotifications = !showNotifications}
					class="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
					aria-label="Notifications"
				>
					<span class="text-xl">🔔</span>
					<!-- Badge for unread notifications -->
					<span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
				</button>
				
				<div class="h-8 w-8 bg-gray-300 rounded-full"></div>
			</div>
		</div>
		
		<!-- Mobile Navigation -->
		<div class="md:hidden pb-4">
			<div class="flex flex-wrap gap-2">
				{#each navItems as item}
					<a
						href={item.path}
						class="px-3 py-1 rounded text-sm {isActive(item.path)
							? 'bg-[var(--hku-green)] text-white'
							: 'bg-gray-100 text-gray-700'}"
					>
						{item.icon} {item.label}
					</a>
				{/each}
			</div>
		</div>
	</div>
</nav>


