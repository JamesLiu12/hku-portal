/**
 * Simple hardcoded prerequisite trees for prototype
 */

export type PrerequisiteRelationship = 'and' | 'or';

export type ProgressStatus = 'completed' | 'eligible' | 'not-met';

export type PrerequisiteNode =
	| {
			type: 'course';
			code: string;
			name: string;
			status: ProgressStatus;
			completed?: boolean;
			grade?: string;
			minimumGrade?: string;
			relationship?: PrerequisiteRelationship;
			prerequisites?: PrerequisiteNode[];
	  }
	| {
			type: 'group';
			operator: 'AND' | 'OR';
			label?: string;
			relationship?: PrerequisiteRelationship;
			children: PrerequisiteNode[];
	  };

export interface SimpleTree {
	courseCode: string;
	courseName: string;
	status: ProgressStatus;
	prerequisites?: PrerequisiteNode[];
}

export const mockTrees: SimpleTree[] = [
	{
		courseCode: 'COMP3352',
		courseName: 'Algorithmic Game Theory',
		status: 'not-met',
		prerequisites: [
			{
				type: 'group',
				operator: 'OR',
				label: 'Any one of',
				relationship: 'and',
				children: [
					{
						type: 'course',
						code: 'MATH1853',
						name: 'Linear Algebra, Probability and Statistics',
						status: 'completed',
						completed: true,
						relationship: 'or'
					},
					{
						type: 'course',
						code: 'MATH2101',
						name: 'Linear Algebra I',
						status: 'eligible',
						relationship: 'or',
						prerequisites: [
							{
								type: 'group',
								operator: 'OR',
								label: 'Any one of',
								children: [
									{
										type: 'course',
										code: 'MATH1013',
										name: 'University Mathematics II',
										status: 'completed',
										completed: true,
										relationship: 'or'
									},
									{
										type: 'course',
										code: 'MATH1821',
										name: 'Mathematical Methods for Actuarial Science I',
										status: 'eligible',
										relationship: 'or'
									},
									{
										type: 'course',
										code: 'MATH1853',
										name: 'Linear Algebra, Probability and Statistics',
										status: 'completed',
										completed: true,
										relationship: 'or'
									}
								]
							}
						]
					}
				]
			},
			{
				type: 'course',
				code: 'COMP2119',
				name: 'Introduction to Data Structures and Algorithms',
				status: 'not-met',
				relationship: 'and',
				prerequisites: [
					{
						type: 'group',
						operator: 'OR',
						label: 'Any one of',
						children: [
							{
								type: 'course',
								code: 'COMP2113',
								name: 'Software Engineering',
								status: 'eligible',
								relationship: 'or'
							},
							{
								type: 'course',
								code: 'COMP2123',
								name: 'Programming Technologies and Tools',
								status: 'eligible',
								relationship: 'or',
								prerequisites: [
									{
										type: 'group',
										operator: 'OR',
										label: 'Any one of',
										children: [
											{
												type: 'course',
												code: 'COMP1117',
												name: 'Computer Programming',
												status: 'completed',
												completed: true,
												relationship: 'or'
											},
											{
												type: 'course',
												code: 'CSIS1117',
												name: 'Programming Technologies',
												status: 'eligible',
												relationship: 'or'
											},
											{
												type: 'course',
												code: 'ENGG1002',
												name: 'Introduction to Engineering Design',
												status: 'eligible',
												relationship: 'or'
											},
											{
												type: 'course',
												code: 'ENGG1111',
												name: 'Introduction to Engineering Analysis',
												status: 'eligible',
												relationship: 'or'
											},
											{
												type: 'course',
												code: 'ENGG1112',
												name: 'Engineering Computation',
												status: 'eligible',
												relationship: 'or'
											}
										]
									}
								]
							},
							{
								type: 'course',
								code: 'ENGG1340',
								name: 'Computer Programming II',
								status: 'eligible',
								relationship: 'or',
								prerequisites: [
									{
										type: 'course',
										code: 'ENGG1330',
										name: 'Computer Programming I',
										status: 'completed',
										completed: true,
										relationship: 'and'
									}
								]
							}
						]
					}
				]
			}
		]
	},
	{
		courseCode: 'MATH1853',
		courseName: 'Linear Algebra, Probability and Statistics',
		status: 'completed',
		prerequisites: []
	},

	{
		courseCode: 'MATH2101',
		courseName: 'Linear Algebra I',
		status: 'eligible',
		prerequisites: [
			{
				type: 'group',
				operator: 'OR',
				label: 'Any one of',
				children: [
					{
						type: 'course',
						code: 'MATH1013',
						name: 'University Mathematics II',
						status: 'completed',
						completed: true,
						relationship: 'or'
					},
					{
						type: 'course',
						code: 'MATH1821',
						name: 'Mathematical Methods for Actuarial Science I',
						status: 'eligible',
						relationship: 'or'
					},
					{
						type: 'course',
						code: 'MATH1853',
						name: 'Linear Algebra, Probability and Statistics',
						status: 'completed',
						completed: true,
						relationship: 'or'
					}
				]
			}
		]
	},
	{
		courseCode: 'MATH1013',
		courseName: 'University Mathematics II',
		status: 'completed',
		prerequisites: []
	},
	{
		courseCode: 'MATH1821',
		courseName: 'Mathematical Methods for Actuarial Science I',
		status: 'eligible',
		prerequisites: []
	},
    
	{
		courseCode: 'COMP2119',
		courseName: 'Introduction to Data Structures and Algorithms',
		status: 'not-met',
		prerequisites: [
			{
				type: 'group',
				operator: 'OR',
				label: 'Any one of',
				children: [
					{
						type: 'course',
						code: 'COMP2113',
						name: 'Software Engineering',
						status: 'eligible',
						relationship: 'or'
					},
					{
						type: 'course',
						code: 'COMP2123',
						name: 'Programming Technologies and Tools',
						status: 'eligible',
						relationship: 'or',
						prerequisites: [
							{
								type: 'group',
								operator: 'OR',
								label: 'Any one of',
								children: [
									{
										type: 'course',
										code: 'COMP1117',
										name: 'Computer Programming',
										status: 'completed',
										completed: true,
										relationship: 'or'
									},
									{
										type: 'course',
										code: 'CSIS1117',
										name: 'Programming Technologies',
										status: 'eligible',
										relationship: 'or'
									},
									{
										type: 'course',
										code: 'ENGG1002',
										name: 'Introduction to Engineering Design',
										status: 'eligible',
										relationship: 'or'
									},
									{
										type: 'course',
										code: 'ENGG1111',
										name: 'Introduction to Engineering Analysis',
										status: 'eligible',
										relationship: 'or'
									},
									{
										type: 'course',
										code: 'ENGG1112',
										name: 'Engineering Computation',
										status: 'eligible',
										relationship: 'or'
									}
								]
							}
						]
					},
					{
						type: 'course',
						code: 'ENGG1340',
						name: 'Computer Programming II',
						status: 'eligible',
						relationship: 'or',
						prerequisites: [
							{
								type: 'course',
								code: 'ENGG1330',
								name: 'Computer Programming I',
								status: 'completed',
								completed: true,
								relationship: 'and'
							}
						]
					}
				]
			}
		]
	},
	{
		courseCode: 'COMP1117',
		courseName: 'Computer Programming',
		status: 'completed',
		prerequisites: []
	},
	{
		courseCode: 'ENGG1330',
		courseName: 'Computer Programming I',
		status: 'completed',
		prerequisites: []
	},
	{
		courseCode: 'ENGG1340',
		courseName: 'Computer Programming II',
		status: 'eligible',
		prerequisites: [
			{
				type: 'course',
				code: 'ENGG1330',
				name: 'Computer Programming I',
				status: 'completed',
				completed: true,
				relationship: 'and'
			}
		]
	},
	{
		courseCode: 'COMP2123',
		courseName: 'Programming Technologies and Tools',
		status: 'eligible',
		prerequisites: [
			{
				type: 'group',
				operator: 'OR',
				label: 'Any one of',
				children: [
					{
						type: 'course',
						code: 'COMP1117',
						name: 'Computer Programming',
						status: 'completed',
						completed: true,
						relationship: 'or'
					},
					{
						type: 'course',
						code: 'CSIS1117',
						name: 'Programming Technologies',
						status: 'eligible',
						relationship: 'or'
					},
					{
						type: 'course',
						code: 'ENGG1002',
						name: 'Introduction to Engineering Design',
						status: 'eligible',
						relationship: 'or'
					},
					{
						type: 'course',
						code: 'ENGG1111',
						name: 'Introduction to Engineering Analysis',
						status: 'eligible',
						relationship: 'or'
					},
					{
						type: 'course',
						code: 'ENGG1112',
						name: 'Engineering Computation',
						status: 'eligible',
						relationship: 'or'
					}
				]
			}
		]
	}
];

export function getTree(courseCode: string): SimpleTree | null {
	return mockTrees.find(t => t.courseCode.toUpperCase() === courseCode.toUpperCase()) || null;
}

export function getAvailableCourseCodes(): string[] {
	return mockTrees.map(t => t.courseCode);
}
