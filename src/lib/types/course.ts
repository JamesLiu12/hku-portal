export interface Course {
	id: string;
	code: string;
	name: string;
	credits: number;
	department: string;
	faculty: string;
	description?: string;
	prerequisites?: Prerequisite[];
	corequisites?: string[];
	exclusions?: string[];
}

export interface Prerequisite {
	courseCode: string;
	courseName: string;
	required: boolean;
	minimumGrade?: string;
	// For complex prerequisites like "COMP1111 OR COMP1112"
	logic?: 'AND' | 'OR';
	alternatives?: Prerequisite[];
}

export interface PrerequisiteTree {
	course: Course;
	prerequisites: PrerequisiteNode[];
	status: 'met' | 'partial' | 'not-met';
}

export interface PrerequisiteNode {
	prerequisite: Prerequisite;
	children?: PrerequisiteNode[];
	status: 'met' | 'partial' | 'not-met';
	completed?: boolean;
	grade?: string;
}


