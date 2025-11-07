<script lang="ts">
	import type { Alert } from '$lib/types/notification';
	
	let alerts = $state<Alert[]>([
		{
			id: '1',
			type: 'seat-available',
			title: 'Seat Available in COMP1111',
			message: 'A seat has opened in COMP1111 - Section A. Enroll now before it fills up!',
			priority: 'high',
			read: false,
			createdAt: new Date(),
			actionUrl: '/timetable/builder',
			actionLabel: 'View Timetable',
			relatedCourse: 'COMP1111'
		},
		{
			id: '2',
			type: 'venue-change',
			title: 'Venue Changed',
			message: 'COMP1111 Lecture has moved to MB G07',
			priority: 'normal',
			read: false,
			createdAt: new Date(Date.now() - 3600000),
			relatedCourse: 'COMP1111',
			relatedSection: 'L01'
		},
		{
			id: '3',
			type: 'deadline-approaching',
			title: 'Enrollment Deadline Approaching',
			message: 'Add/Drop period ends in 2 days',
			priority: 'urgent',
			read: true,
			createdAt: new Date(Date.now() - 86400000)
		}
	]);
	
	function markAsRead(alertId: string) {
		const alert = alerts.find((a) => a.id === alertId);
		if (alert) {
			alert.read = true;
		}
	}
	
	function markAllAsRead() {
		alerts.forEach((alert) => {
			alert.read = true;
		});
	}
	
	const unreadCount = $derived(alerts.filter((a) => !a.read).length);
</script>

<svelte:head>
	<title>Alerts - HKU Helper</title>
</svelte:head>

<div class="space-y-6">
	<div class="card">
		<div class="flex items-center justify-between mb-6">
			<div>
				<h1 class="text-2xl font-bold">Alerts & Notifications</h1>
				<p class="text-gray-600 mt-1">
					{unreadCount} unread {unreadCount === 1 ? 'alert' : 'alerts'}
				</p>
			</div>
			{#if unreadCount > 0}
				<button onclick={markAllAsRead} class="btn btn-secondary">
					Mark All as Read
				</button>
			{/if}
		</div>
		
		<!-- Filter Tabs -->
		<div class="flex space-x-2 mb-6 border-b border-gray-200">
			<button class="px-4 py-2 border-b-2 border-[var(--hku-green)] font-medium">
				All
			</button>
			<button class="px-4 py-2 text-gray-600 hover:text-gray-900">Unread</button>
			<button class="px-4 py-2 text-gray-600 hover:text-gray-900">Settings</button>
		</div>
		
		<!-- Alerts List -->
		<div class="space-y-3">
			{#each alerts as alert}
				<div
					class="p-4 rounded-lg border transition-colors {alert.read
						? 'bg-gray-50 border-gray-200'
						: 'bg-white border-gray-300 shadow-sm'} {alert.priority === 'urgent'
						? 'border-l-4 border-l-red-500'
						: alert.priority === 'high'
							? 'border-l-4 border-l-orange-500'
							: ''}"
				>
					<div class="flex items-start justify-between">
						<div class="flex-1">
							<div class="flex items-center space-x-2 mb-1">
								<h3 class="font-semibold text-gray-900">{alert.title}</h3>
								{#if !alert.read}
									<span class="w-2 h-2 bg-blue-500 rounded-full"></span>
								{/if}
							</div>
							<p class="text-sm text-gray-600 mb-2">{alert.message}</p>
							<div class="flex items-center space-x-4 text-xs text-gray-500">
								<time>{new Date(alert.createdAt).toLocaleString()}</time>
								{#if alert.relatedCourse}
									<span>• Course: {alert.relatedCourse}</span>
								{/if}
							</div>
						</div>
						<div class="flex items-center space-x-2 ml-4">
							{#if alert.actionUrl}
								<a href={alert.actionUrl} class="btn btn-primary text-sm">
									{alert.actionLabel || 'View'}
								</a>
							{/if}
							{#if !alert.read}
								<button
									onclick={() => markAsRead(alert.id)}
									class="text-gray-400 hover:text-gray-600"
									aria-label="Mark as read"
								>
									✓
								</button>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
		
		{#if alerts.length === 0}
			<div class="text-center py-12">
				<p class="text-gray-500">No alerts at this time</p>
			</div>
		{/if}
	</div>
</div>


