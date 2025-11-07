<script lang="ts">
	import SISMenu from '$lib/components/SISMenu.svelte';
	
	// Quick stats - would come from API
	const stats = $state({
		enrolledCourses: 5,
		pendingAlerts: 3,
		timetableConflicts: 0
	});
</script>

<svelte:head>
	<title>HKU Helper - Home</title>
</svelte:head>

<div class="space-y-6">
	<!-- Welcome Section -->
	<div class="card">
		<h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome to HKU Helper</h1>
		<p class="text-gray-600">Your modern gateway to campus life and academic management</p>
	</div>
	
	<!-- Quick Stats -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<div class="card">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-gray-600">Enrolled Courses</p>
					<p class="text-2xl font-bold text-gray-900">{stats.enrolledCourses}</p>
				</div>
				<span class="text-3xl">📚</span>
			</div>
		</div>
		
		<div class="card">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-gray-600">Pending Alerts</p>
					<p class="text-2xl font-bold text-gray-900">{stats.pendingAlerts}</p>
				</div>
				<span class="text-3xl">🔔</span>
			</div>
		</div>
		
		<div class="card">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-gray-600">Timetable Conflicts</p>
					<p class="text-2xl font-bold text-gray-900">{stats.timetableConflicts}</p>
				</div>
				<span class="text-3xl">⚠️</span>
			</div>
		</div>
	</div>
	
	<!-- Main Content Grid -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Left Column: Quick Access & SIS Menu -->
		<div class="lg:col-span-2 space-y-6">
			<!-- Quick Access -->
			<div class="card">
				<h2 class="text-xl font-bold mb-4">Quick Access</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<a
						href="/courses/prerequisites"
						class="p-4 border border-gray-200 rounded-lg hover:border-[var(--hku-green)] hover:shadow-md transition-all"
					>
						<div class="text-2xl mb-2">📚</div>
						<h3 class="font-semibold">Course Prerequisites</h3>
						<p class="text-sm text-gray-600">Check course requirements and eligibility</p>
					</a>
					
					<a
						href="/timetable/builder"
						class="p-4 border border-gray-200 rounded-lg hover:border-[var(--hku-green)] hover:shadow-md transition-all"
					>
						<div class="text-2xl mb-2">📅</div>
						<h3 class="font-semibold">Timetable Builder</h3>
						<p class="text-sm text-gray-600">Plan your schedule with conflict detection</p>
					</a>
					
					<a
						href="/map"
						class="p-4 border border-gray-200 rounded-lg hover:border-[var(--hku-green)] hover:shadow-md transition-all"
					>
						<div class="text-2xl mb-2">🗺️</div>
						<h3 class="font-semibold">Campus Map</h3>
						<p class="text-sm text-gray-600">Find buildings and get directions</p>
					</a>
					
					<a
						href="/queue/canteens"
						class="p-4 border border-gray-200 rounded-lg hover:border-[var(--hku-green)] hover:shadow-md transition-all"
					>
						<div class="text-2xl mb-2">⏱️</div>
						<h3 class="font-semibold">Queue Times</h3>
						<p class="text-sm text-gray-600">Check canteen wait times and MTR exits</p>
					</a>
					
					<a
						href="/alerts"
						class="p-4 border border-gray-200 rounded-lg hover:border-[var(--hku-green)] hover:shadow-md transition-all"
					>
						<div class="text-2xl mb-2">🔔</div>
						<h3 class="font-semibold">Alerts</h3>
						<p class="text-sm text-gray-600">View notifications and manage preferences</p>
					</a>
				</div>
			</div>
		</div>
		
		<!-- Right Column: SIS Menu -->
		<div class="lg:col-span-1">
			<SISMenu />
		</div>
	</div>
</div>
