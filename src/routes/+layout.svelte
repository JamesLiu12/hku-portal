<script lang="ts">
	import '../app.css';
	import Navigation from '$lib/components/Navigation.svelte';
	import NotificationCenter from '$lib/components/NotificationCenter.svelte';

	let { children } = $props();
	
	let showNotifications = $state(false);
</script>

<svelte:head>
	<title>HKU Helper</title>
	<meta name="description" content="Modern HKU Helper - Your gateway to campus life" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<Navigation bind:showNotifications />
	
	<main class="container mx-auto px-4 py-6">
{@render children()}
	</main>
	
	<NotificationCenter bind:showNotifications />
</div>
