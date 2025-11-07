<script lang="ts">
	import type { CourseSection } from '$lib/types/timetable';
	
	let { sections } = $props<{ sections: CourseSection[] }>();
	
	const days = [
		{ name: 'Sun', value: 0 },
		{ name: 'Mon', value: 1 },
		{ name: 'Tue', value: 2 },
		{ name: 'Wed', value: 3 },
		{ name: 'Thu', value: 4 },
		{ name: 'Fri', value: 5 },
		{ name: 'Sat', value: 6 }
	];
	
const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM
const gridTemplate = '80px repeat(7, minmax(120px, 1fr))';
	
	function timeToMinutes(time: string): number {
		const [hours, minutes] = time.split(':').map(Number);
		return hours * 60 + minutes;
	}
	
	function minutesToPercent(startMin: number, endMin: number): { top: string; height: string } {
		const dayStart = 8 * 60; // 8:00 AM in minutes
		const dayEnd = 22 * 60; // 10:00 PM in minutes
		const dayDuration = dayEnd - dayStart;
		
		const top = ((startMin - dayStart) / dayDuration) * 100;
		const height = ((endMin - startMin) / dayDuration) * 100;
		
		return {
			top: `${top}%`,
			height: `${height}%`
		};
	}
	
	function getSectionColor(type: CourseSection['type']): string {
		switch (type) {
			case 'Lecture':
				return 'bg-blue-500';
			case 'Tutorial':
				return 'bg-green-500';
			case 'Lab':
				return 'bg-purple-500';
			case 'Seminar':
				return 'bg-orange-500';
			default:
				return 'bg-gray-500';
		}
	}
	
	function getSectionsForDay(day: number): CourseSection[] {
		return sections.filter(s => s.day === day).sort((a, b) => {
			return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
		});
	}
</script>

<div class="w-full overflow-x-auto touch-pan-x">
    <div class="min-w-[900px] sm:min-w-full border border-gray-200 rounded-lg bg-white">
		<!-- Header -->
        <div class="grid border-b border-gray-200 bg-gray-50" style={`grid-template-columns: ${gridTemplate};`}>
			<div class="p-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
				Time
			</div>
			{#each days as day}
				<div class="p-3 text-sm font-semibold text-gray-700 text-center border-r border-gray-200 last:border-r-0">
					{day.name}
				</div>
			{/each}
		</div>
		
		<!-- Time slots and content -->
        <div class="relative" style="height: 800px;">
			<!-- Day columns -->
            <div class="grid h-full relative z-10" style={`grid-template-columns: ${gridTemplate};`}>
				<!-- Time column -->
				<div class="border-r border-gray-200 bg-gray-50 relative z-20 h-full">
					<!-- Hour markers in time column -->
					{#each hours as hour}
						<div
							class="absolute left-0 right-0 border-t border-gray-100 text-xs text-gray-500 p-2"
							style="top: {((hour - 8) / 14) * 100}%"
						>
							{hour}:00
						</div>
					{/each}
				</div>
				
				<!-- Day columns -->
				{#each days as day}
					<div class="relative border-r border-gray-200 last:border-r-0 h-full">
						<!-- Hour markers in day columns -->
						{#each hours as hour}
							<div
								class="absolute left-0 right-0 border-t border-gray-100 pointer-events-none"
								style="top: {((hour - 8) / 14) * 100}%; z-index: 1;"
							></div>
						{/each}
						
						<!-- Course sections -->
						{#each getSectionsForDay(day.value) as section}
							{@const startMin = timeToMinutes(section.startTime)}
							{@const endMin = timeToMinutes(section.endTime)}
							{@const pos = minutesToPercent(startMin, endMin)}
							<div
                                class="absolute left-0 right-0 mx-1 rounded-md p-2 text-white text-xs md:text-sm cursor-pointer hover:shadow-lg transition-shadow leading-tight space-y-0.5 {getSectionColor(section.type)}"
								style="top: {pos.top}; height: {pos.height}; z-index: 2;"
								title="{section.courseCode} {section.section} - {section.venue} {section.building}"
							>
                                <div class="font-semibold break-words text-xs md:text-sm">{section.courseCode}</div>
                                <div class="break-words text-xs md:text-sm">{section.section} - {section.type}</div>
                                <div class="text-[10px] md:text-xs opacity-90">{section.startTime}-{section.endTime}</div>
                                <div class="text-[10px] md:text-xs opacity-75">{section.venue} {section.building}</div>
							</div>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

