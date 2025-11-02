/**
 * Mock course sections for prototype timetable builder
 */
import type { CourseSection } from '$lib/types/timetable';

export const mockCourseSections: CourseSection[] = [
	// COMP3111 - Machine Learning
	{
		id: 'comp3111-l01',
		courseCode: 'COMP3111',
		courseName: 'Machine Learning',
		section: 'L01',
		type: 'Lecture',
		day: 1, // Monday
		startTime: '10:30',
		endTime: '12:20',
		venue: 'LE1',
		building: 'KK',
		instructor: 'Prof. Smith',
		capacity: 150,
		enrolled: 142,
		waitlist: 5
	},
	{
		id: 'comp3111-t01',
		courseCode: 'COMP3111',
		courseName: 'Machine Learning',
		section: 'T01',
		type: 'Tutorial',
		day: 3, // Wednesday
		startTime: '14:30',
		endTime: '15:20',
		venue: 'R614',
		building: 'CB',
		instructor: 'TA Chen',
		capacity: 30,
		enrolled: 28
	},
	{
		id: 'comp3111-t02',
		courseCode: 'COMP3111',
		courseName: 'Machine Learning',
		section: 'T02',
		type: 'Tutorial',
		day: 4, // Thursday
		startTime: '14:30',
		endTime: '15:20',
		venue: 'R615',
		building: 'CB',
		instructor: 'TA Wong',
		capacity: 30,
		enrolled: 25
	},
	// COMP3001 - Database Systems
	{
		id: 'comp3001-l01',
		courseCode: 'COMP3001',
		courseName: 'Database Systems',
		section: 'L01',
		type: 'Lecture',
		day: 2, // Tuesday
		startTime: '09:30',
		endTime: '11:20',
		venue: 'LT1',
		building: 'KK',
		instructor: 'Prof. Lee',
		capacity: 200,
		enrolled: 195,
		waitlist: 12
	},
	{
		id: 'comp3001-t01',
		courseCode: 'COMP3001',
		courseName: 'Database Systems',
		section: 'T01',
		type: 'Tutorial',
		day: 4, // Thursday
		startTime: '10:30',
		endTime: '11:20',
		venue: 'R501',
		building: 'CB',
		instructor: 'TA Zhang',
		capacity: 35,
		enrolled: 33
	},
	{
		id: 'comp3001-lab01',
		courseCode: 'COMP3001',
		courseName: 'Database Systems',
		section: 'Lab01',
		type: 'Lab',
		day: 5, // Friday
		startTime: '14:30',
		endTime: '16:20',
		venue: 'R401',
		building: 'CB',
		instructor: 'TA Liu',
		capacity: 20,
		enrolled: 18
	},
	// COMP1111 - Introduction to Computer Science
	{
		id: 'comp1111-l01',
		courseCode: 'COMP1111',
		courseName: 'Introduction to Computer Science',
		section: 'L01',
		type: 'Lecture',
		day: 1, // Monday
		startTime: '14:30',
		endTime: '16:20',
		venue: 'LE2',
		building: 'MB',
		instructor: 'Prof. Brown',
		capacity: 300,
		enrolled: 287,
		waitlist: 8
	},
	{
		id: 'comp1111-t01',
		courseCode: 'COMP1111',
		courseName: 'Introduction to Computer Science',
		section: 'T01',
		type: 'Tutorial',
		day: 2, // Tuesday
		startTime: '13:30',
		endTime: '14:20',
		venue: 'R312',
		building: 'CB',
		instructor: 'TA Kim',
		capacity: 40,
		enrolled: 38
	},
	// MATH2011 - Linear Algebra
	{
		id: 'math2011-l01',
		courseCode: 'MATH2011',
		courseName: 'Linear Algebra',
		section: 'L01',
		type: 'Lecture',
		day: 2, // Tuesday
		startTime: '11:30',
		endTime: '13:20',
		venue: 'LE3',
		building: 'KK',
		instructor: 'Prof. Wilson',
		capacity: 180,
		enrolled: 175
	},
	{
		id: 'math2011-t01',
		courseCode: 'MATH2011',
		courseName: 'Linear Algebra',
		section: 'T01',
		type: 'Tutorial',
		day: 4, // Thursday
		startTime: '13:30',
		endTime: '14:20',
		venue: 'R201',
		building: 'MB',
		instructor: 'TA Park',
		capacity: 25,
		enrolled: 23
	},
	// COMP4001 - Final Year Project
	{
		id: 'comp4001-s01',
		courseCode: 'COMP4001',
		courseName: 'Final Year Project',
		section: 'S01',
		type: 'Seminar',
		day: 3, // Wednesday
		startTime: '15:30',
		endTime: '17:20',
		venue: 'R505',
		building: 'CB',
		instructor: 'Prof. Anderson',
		capacity: 50,
		enrolled: 45
	}
];

export function getSectionsByCourse(courseCode: string): CourseSection[] {
	return mockCourseSections.filter(s => s.courseCode.toUpperCase() === courseCode.toUpperCase());
}

export function getAllCourseCodes(): string[] {
	const codes = new Set(mockCourseSections.map(s => s.courseCode));
	return Array.from(codes);
}

export function getSectionById(id: string): CourseSection | undefined {
	return mockCourseSections.find(s => s.id === id);
}

