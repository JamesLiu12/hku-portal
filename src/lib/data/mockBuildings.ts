/**
 * Mock building data for prototype campus map
 */

export interface Building {
	id: string;
	code: string;
	name: string;
	type: 'academic' | 'residential' | 'dining' | 'library' | 'administrative' | 'sports' | 'other';
	coordinates: { x: number; y: number }; // Relative coordinates for prototype map (0-100 scale)
	description?: string;
	facilities?: string[];
	operatingHours?: string;
	popularNames?: string[]; // Alternative names for search
}

export const mockBuildings: Building[] = [
	// Academic Buildings
	{
		id: 'kk',
		code: 'KK',
		name: 'K.K. Leung Building',
		type: 'academic',
		coordinates: { x: 45, y: 35 },
		description: 'Main academic building housing lecture theatres and classrooms',
		facilities: ['Lecture Theatres', 'Classrooms', 'Computer Labs'],
		popularNames: ['Leung Building', 'K.K. Leung']
	},
	{
		id: 'mb',
		code: 'MB',
		name: 'Main Building',
		type: 'academic',
		coordinates: { x: 55, y: 40 },
		description: 'Historic main building with administrative offices and lecture halls',
		facilities: ['Lecture Theatres', 'Administrative Offices', 'Grand Hall'],
		popularNames: ['Main Building', 'Central Building']
	},
	{
		id: 'cb',
		code: 'CB',
		name: 'Chow Yei Ching Building',
		type: 'academic',
		coordinates: { x: 40, y: 45 },
		description: 'Engineering and computer science facilities',
		facilities: ['Computer Labs', 'Engineering Labs', 'Classrooms'],
		popularNames: ['Engineering Building', 'CYC Building']
	},
	{
		id: 'rr',
		code: 'RR',
		name: 'Run Run Shaw Building',
		type: 'academic',
		coordinates: { x: 50, y: 30 },
		description: 'Social sciences and humanities building',
		facilities: ['Lecture Theatres', 'Seminar Rooms', 'Faculty Offices'],
		popularNames: ['RR Shaw', 'Shaw Building']
	},
	
	// Libraries
	{
		id: 'main-library',
		code: 'ML',
		name: 'Main Library',
		type: 'library',
		coordinates: { x: 60, y: 50 },
		description: 'Central library with extensive collections and study spaces',
		facilities: ['Study Areas', 'Group Study Rooms', 'Computer Workstations', 'Printing'],
		operatingHours: 'Mon-Fri: 8:30 AM - 10:00 PM, Sat-Sun: 9:00 AM - 9:00 PM',
		popularNames: ['Library', 'Central Library']
	},
	
	// Dining
	{
		id: 'canteen-1',
		code: 'C1',
		name: 'Main Campus Canteen',
		type: 'dining',
		coordinates: { x: 55, y: 55 },
		description: 'Main student canteen with variety of cuisines',
		facilities: ['Various Cuisines', 'Halal Options', 'Vegetarian Options'],
		operatingHours: 'Mon-Fri: 7:00 AM - 8:00 PM, Sat-Sun: 8:00 AM - 7:00 PM',
		popularNames: ['Main Canteen', 'Student Canteen']
	},
	{
		id: 'canteen-2',
		code: 'C2',
		name: 'Coffee Shop',
		type: 'dining',
		coordinates: { x: 50, y: 50 },
		description: 'Coffee shop and light snacks',
		facilities: ['Coffee', 'Sandwiches', 'Pastries'],
		operatingHours: 'Mon-Fri: 8:00 AM - 6:00 PM',
		popularNames: ['Cafe', 'Coffee House']
	},
	
	// Administrative
	{
		id: 'student-center',
		code: 'SC',
		name: 'Student Centre',
		type: 'administrative',
		coordinates: { x: 65, y: 45 },
		description: 'Student services and support center',
		facilities: ['Student Services', 'Career Center', 'Counseling Services', 'Printing'],
		operatingHours: 'Mon-Fri: 9:00 AM - 5:30 PM',
		popularNames: ['Student Services', 'SC']
	},
	
	// Sports
	{
		id: 'sports-center',
		code: 'SP',
		name: 'Sports Centre',
		type: 'sports',
		coordinates: { x: 35, y: 55 },
		description: 'Indoor sports facilities and gym',
		facilities: ['Gym', 'Basketball Court', 'Badminton Court', 'Fitness Classes'],
		operatingHours: 'Mon-Sun: 7:00 AM - 10:00 PM',
		popularNames: ['Gym', 'Sports Hall']
	},
	
	// MTR Exit
	{
		id: 'mtr-exit',
		code: 'MTR',
		name: 'MTR Station Exit',
		type: 'other',
		coordinates: { x: 70, y: 60 },
		description: 'Main MTR station exit to campus',
		popularNames: ['MTR', 'Station', 'Metro']
	}
];

export function searchBuildings(query: string): Building[] {
	if (!query || query.trim() === '') return [];
	
	const lowerQuery = query.toLowerCase().trim();
	
	return mockBuildings.filter(building => {
		// Search by code
		if (building.code.toLowerCase().includes(lowerQuery)) return true;
		
		// Search by name
		if (building.name.toLowerCase().includes(lowerQuery)) return true;
		
		// Search by popular names
		if (building.popularNames?.some(name => name.toLowerCase().includes(lowerQuery))) return true;
		
		// Search by type
		if (building.type.toLowerCase().includes(lowerQuery)) return true;
		
		return false;
	});
}

export function getBuildingByCode(code: string): Building | undefined {
	return mockBuildings.find(b => b.code.toUpperCase() === code.toUpperCase());
}

export function getBuildingById(id: string): Building | undefined {
	return mockBuildings.find(b => b.id === id);
}

export function calculateDistance(building1: Building, building2: Building): number {
	// Simple Euclidean distance calculation for prototype
	const dx = building1.coordinates.x - building2.coordinates.x;
	const dy = building1.coordinates.y - building2.coordinates.y;
	return Math.sqrt(dx * dx + dy * dy);
}

export function getTravelTime(building1: Building, building2: Building): number {
	// Estimate walking time based on distance (scale: ~1 minute per 10 units)
	const distance = calculateDistance(building1, building2);
	return Math.round((distance / 10) * 60); // Convert to seconds, then to minutes
}


