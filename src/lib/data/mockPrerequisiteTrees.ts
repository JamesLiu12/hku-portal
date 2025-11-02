/**
 * Simple hardcoded prerequisite trees for prototype
 */

export interface SimpleTree {
	courseCode: string;
	courseName: string;
	status: 'met' | 'partial' | 'not-met';
	prerequisites?: Array<{
		code: string;
		name: string;
		status: 'met' | 'partial' | 'not-met';
		completed?: boolean;
		grade?: string;
		minimumGrade?: string;
		prerequisites?: Array<{
			code: string;
			name: string;
			status: 'met' | 'partial' | 'not-met';
			completed?: boolean;
			grade?: string;
		}>;
	}>;
}

export const mockTrees: SimpleTree[] = [
	{
		courseCode: 'COMP3111',
		courseName: 'Machine Learning',
		status: 'not-met',
		prerequisites: [
			{
				code: 'COMP2111',
				name: 'Advanced Algorithms',
				status: 'not-met',
				minimumGrade: 'B',
				prerequisites: [
					{
						code: 'COMP1112',
						name: 'Data Structures and Algorithms',
						status: 'met',
						completed: true,
						grade: 'A'
					}
				]
			},
			{
				code: 'MATH2011',
				name: 'Linear Algebra',
				status: 'met',
				completed: true,
				grade: 'B',
				minimumGrade: 'B-',
				prerequisites: [
					{
						code: 'MATH1011',
						name: 'Calculus I',
						status: 'met',
						completed: true,
						grade: 'A-'
					}
				]
			}
		]
	},
	{
		courseCode: 'COMP3001',
		courseName: 'Database Systems',
		status: 'met',
		prerequisites: [
			{
				code: 'COMP1112',
				name: 'Data Structures and Algorithms',
				status: 'met',
				completed: true,
				grade: 'A',
				minimumGrade: 'C',
				prerequisites: [
					{
						code: 'COMP1111',
						name: 'Introduction to Computer Science',
						status: 'met',
						completed: true,
						grade: 'A'
					}
				]
			},
			{
				code: 'MATH2011',
				name: 'Linear Algebra',
				status: 'met',
				completed: true,
				grade: 'B'
			}
		]
	},
	{
		courseCode: 'COMP4001',
		courseName: 'Final Year Project',
		status: 'not-met',
		prerequisites: [
			{
				code: 'COMP3111',
				name: 'Machine Learning',
				status: 'not-met',
				completed: false
			}
		]
	},
	{
		courseCode: 'COMP1111',
		courseName: 'Introduction to Computer Science',
		status: 'met',
		prerequisites: []
	}
];

export function getTree(courseCode: string): SimpleTree | null {
	return mockTrees.find(t => t.courseCode.toUpperCase() === courseCode.toUpperCase()) || null;
}

export function getAvailableCourseCodes(): string[] {
	return mockTrees.map(t => t.courseCode);
}
