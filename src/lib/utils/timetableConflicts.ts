/**
 * Conflict detection utilities for timetable
 */
import type { CourseSection, TimeConflict } from '$lib/types/timetable';

/**
 * Convert time string (HH:MM) to minutes since midnight
 */
function timeToMinutes(time: string): number {
	const [hours, minutes] = time.split(':').map(Number);
	return hours * 60 + minutes;
}

/**
 * Check if two time intervals overlap
 */
function timeOverlaps(
	start1: number,
	end1: number,
	start2: number,
	end2: number
): boolean {
	return start1 < end2 && start2 < end1;
}

/**
 * Calculate minimum travel time between buildings (in minutes)
 * This is a simplified calculation for prototype
 */
function getTravelTime(building1: string, building2: string): number {
	if (building1 === building2) return 0;
	
	// Hardcoded travel times for prototype
	const travelTimes: Record<string, Record<string, number>> = {
		'KK': { 'MB': 10, 'CB': 5 },
		'MB': { 'KK': 10, 'CB': 8 },
		'CB': { 'KK': 5, 'MB': 8 }
	};
	
	return travelTimes[building1]?.[building2] || 15; // Default 15 minutes
}

/**
 * Detect all conflicts in a timetable
 */
export function detectConflicts(sections: CourseSection[]): TimeConflict[] {
	const conflicts: TimeConflict[] = [];
	
	for (let i = 0; i < sections.length; i++) {
		for (let j = i + 1; j < sections.length; j++) {
			const section1 = sections[i];
			const section2 = sections[j];
			
			// Only check conflicts for same day
			if (section1.day !== section2.day) continue;
			
			const start1 = timeToMinutes(section1.startTime);
			const end1 = timeToMinutes(section1.endTime);
			const start2 = timeToMinutes(section2.startTime);
			const end2 = timeToMinutes(section2.endTime);
			
			// Check for direct overlap
			if (timeOverlaps(start1, end1, start2, end2)) {
				conflicts.push({
					section1,
					section2,
					type: 'overlap',
					severity: 'error',
					message: `${section1.courseCode} ${section1.section} (${section1.startTime}-${section1.endTime}) overlaps with ${section2.courseCode} ${section2.section} (${section2.startTime}-${section2.endTime})`
				});
				continue;
			}
			
			// Check for travel time conflicts
			let earlierSection: CourseSection;
			let laterSection: CourseSection;
			if (end1 <= start2) {
				earlierSection = section1;
				laterSection = section2;
			} else if (end2 <= start1) {
				earlierSection = section2;
				laterSection = section1;
			} else {
				continue; // Already handled as overlap
			}
			
			const timeBetween = timeToMinutes(laterSection.startTime) - timeToMinutes(earlierSection.endTime);
			const requiredTravelTime = getTravelTime(earlierSection.building, laterSection.building);
			const minimumBreak = 15; // 15 minutes minimum break
			
			if (timeBetween < requiredTravelTime + minimumBreak) {
				conflicts.push({
					section1: earlierSection,
					section2: laterSection,
					type: 'travel-time',
					severity: 'warning',
					message: `Insufficient time between ${earlierSection.courseCode} ${earlierSection.section} (${earlierSection.venue}, ${earlierSection.building}) and ${laterSection.courseCode} ${laterSection.section} (${laterSection.venue}, ${laterSection.building}). Need ${requiredTravelTime + minimumBreak} minutes, only ${timeBetween} minutes available.`
				});
			} else if (timeBetween < minimumBreak) {
				conflicts.push({
					section1: earlierSection,
					section2: laterSection,
					type: 'minimum-break',
					severity: 'warning',
					message: `Less than ${minimumBreak} minutes break between ${earlierSection.courseCode} ${earlierSection.section} and ${laterSection.courseCode} ${laterSection.section}`
				});
			}
		}
	}
	
	return conflicts;
}

