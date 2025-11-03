<script lang="ts">
	let { showNotifications = $bindable(false) } = $props();
	
	// Mock data - replace with actual store
	const alerts = $state([
		{
			id: '1',
			type: 'seat-available',
			title: 'Seat Available',
			message: 'A seat has opened in COMP1111 - Section A',
			priority: 'high',
			read: false,
			createdAt: new Date(),
			actionUrl: '/timetable/builder',
			actionLabel: 'Enroll Now'
		}
	]);
</script>

{#if showNotifications}
	<div
		class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
		onclick={(e) => {
			if (e.target === e.currentTarget) {
				showNotifications = false;
			}
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') {
				showNotifications = false;
			}
		}}
		role="dialog"
		aria-modal="true"
		aria-label="Notifications"
		tabindex="-1"
	>
		<div
			class="bg-white w-full max-w-md h-full shadow-xl overflow-y-auto"
		>
			<div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
				<h2 class="text-xl font-bold">Notifications</h2>
				<button
					onclick={() => showNotifications = false}
					class="text-gray-500 hover:text-gray-700"
					aria-label="Close"
				>
					✕
				</button>
			</div>
			
			<div class="p-4 space-y-2">
				{#if alerts.length === 0}
					<div class="text-center py-8 text-gray-500">
						<p>No notifications</p>
					</div>
				{:else}
					{#each alerts as alert}
						<div
							class="p-4 rounded-lg border {alert.priority === 'urgent'
								? 'border-red-500 bg-red-50'
								: alert.priority === 'high'
									? 'border-orange-500 bg-orange-50'
									: 'border-gray-200 bg-gray-50'}"
						>
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<h3 class="font-semibold text-gray-900">{alert.title}</h3>
									<p class="text-sm text-gray-600 mt-1">{alert.message}</p>
									<time class="text-xs text-gray-400 mt-2 block">
										{new Date(alert.createdAt).toLocaleString()}
									</time>
								</div>
								{#if !alert.read}
									<span class="w-2 h-2 bg-blue-500 rounded-full"></span>
								{/if}
							</div>
							{#if alert.actionUrl}
								<a
									href={alert.actionUrl}
									class="mt-3 inline-block text-sm text-[var(--hku-green)] hover:underline"
								>
									{alert.actionLabel || 'View Details'}
								</a>
							{/if}
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
{/if}


