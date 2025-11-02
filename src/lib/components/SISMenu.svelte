<script lang="ts">
	interface MenuItem {
		label: string;
		path?: string;
		icon?: string;
	}

	interface MenuCategory {
		title: string;
		icon: string;
		items: MenuItem[];
	}

	let categories = $state<MenuCategory[]>([
		{
			title: 'Self Services',
			icon: '📋',
			items: [
				{ label: 'Student Center', path: '#' },
				{ label: 'Request Temporary Adviser', path: '#' },
				{ label: 'Master Registration', path: '#' },
				{ label: 'View & Change Personal Info', path: '#' },
				{ label: 'Honors and Awards', path: '#' },
				{ label: 'Student Card Document Upload', path: '#' },
				{ label: 'Compulsory Upload of Visa Docs', path: '#' },
				{ label: 'Collection of Card (1st Year)', path: '#' },
				{ label: 'Report Lost/ Damaged Card', path: '#' },
				{ label: 'Guide to Reveal SIS Menu Links', path: '#' },
				{ label: 'HKU Event Calendar (Timetable)', path: '#' }
			]
		},
		{
			title: 'Enrollment',
			icon: '📝',
			items: [
				{ label: 'Class Schedule Planner', path: '/timetable/builder' },
				{ label: 'Course Selection Chatbot GPT', path: '#' },
				{ label: 'Declare Major/Minor/Special', path: '#' },
				{ label: 'Course Information', path: '/courses/prerequisites' },
				{ label: 'Course Effectiveness Profile', path: '#' },
				{ label: 'Enroll Intensive ACE Class', path: '#' },
				{ label: 'Enrollment Add Classes', path: '#' },
				{ label: 'Enrollment Drop Classes', path: '#' },
				{ label: 'Enrollment Status', path: '#' },
				{ label: 'Common Core Queue Position', path: '#' },
				{ label: 'My Course History', path: '#' }
			]
		},
		{
			title: 'Timetables',
			icon: '📅',
			items: [
				{ label: 'Class Timetable', path: '/timetable/builder' },
				{ label: 'My Weekly Schedule', path: '/timetable/builder' },
				{ label: 'My Timetable (Lect.+Tutorials)', path: '/timetable/builder' },
				{ label: 'Examination Timetables', path: '#' }
			]
		},
		{
			title: 'Academic Records',
			icon: '📊',
			items: [
				{ label: 'View My Grades', path: '#' },
				{ label: 'Transcript (Student Copy)', path: '#' },
				{ label: 'My Degree Audit', path: '#' },
				{ label: 'My Degree Classification', path: '#' }
			]
		},
		{
			title: 'Financial Services',
			icon: '💰',
			items: [
				{ label: 'Account Summary & Transactions', path: '#' },
				{ label: 'My Invoice', path: '#' },
				{ label: 'My Receipt', path: '#' },
				{ label: 'FPS Payment', path: '#' },
				{ label: 'View / Amend Bank Account Info', path: '#' },
				{ label: 'CEDARS Student Award Info', path: '#' },
				{ label: 'FEO eForms', path: '#' },
				{ label: 'FEO Info and Hotlines', path: '#' }
			]
		},
		{
			title: 'Online Applications',
			icon: '📄',
			items: [
				{ label: 'Application for Awards', path: '#' },
				{ label: 'Application for Hall/College', path: '#' },
				{ label: 'Application for Transcript', path: '#' },
				{ label: 'Application for Testimonial', path: '#' },
				{ label: 'Application for AAP', path: '#' },
				{ label: 'Collection of Certificate', path: '#' },
				{ label: 'UFA Main Exercise', path: '#' },
				{ label: 'Apply for Traditional Lockers', path: '#' }
			]
		}
	]);

	let expandedCategories = $state<Set<string>>(new Set(['SIS Menu', 'Enrollment']));
	
	function toggleCategory(categoryTitle: string) {
		expandedCategories = new Set(expandedCategories);
		if (expandedCategories.has(categoryTitle)) {
			expandedCategories.delete(categoryTitle);
		} else {
			expandedCategories.add(categoryTitle);
		}
	}
</script>

<div class="card">
	<h2 class="text-2xl font-bold mb-6">SIS Menu</h2>
	
	<div class="space-y-2">
		{#each categories as category}
			<div class="border border-gray-200 rounded-lg overflow-hidden">
				<button
					onclick={() => toggleCategory(category.title)}
					class="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
				>
					<div class="flex items-center space-x-3">
						<span class="text-xl">{category.icon}</span>
						<span class="font-semibold text-gray-900">{category.title}</span>
						<span class="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
							{category.items.length}
						</span>
					</div>
					<span class="text-gray-400">
						{expandedCategories.has(category.title) ? '▼' : '▶'}
					</span>
				</button>
				
				{#if expandedCategories.has(category.title)}
					<div class="border-t border-gray-200 bg-white">
						<ul class="divide-y divide-gray-100">
							{#each category.items as item}
								<li>
									<a
										href={item.path || '#'}
										class="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[var(--hku-green)] hover:text-white transition-colors"
									>
										{item.label}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

