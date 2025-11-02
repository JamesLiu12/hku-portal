export interface CourseSection {
	id: string;
	courseCode: string;
	courseName: string;
	section: string;
	type: 'Lecture' | 'Tutorial' | 'Lab' | 'Seminar' | 'Other';
	day: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
	startTime: string; // Format: "HH:MM"
	endTime: string; // Format: "HH:MM"
	venue: string;
	building: string;
	instructor?: string;
	capacity: number;
	enrolled: number;
	waitlist?: number;
}

export interface Timetable {
	id?: string;
	name?: string;
	sections: CourseSection[];
	createdAt?: Date;
	updatedAt?: Date;
}

export interface TimeConflict {
	section1: CourseSection;
	section2: CourseSection;
	type: 'overlap' | 'travel-time' | 'minimum-break';
	severity: 'error' | 'warning';
	message: string;
}


