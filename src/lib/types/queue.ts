export interface Canteen {
	id: string;
	name: string;
	nameZh?: string;
	building: string;
	location: string;
	coordinates: {
		lat: number;
		lng: number;
	};
	operatingHours: {
		[day: string]: {
			open: string;
			close: string;
		};
	};
	cuisines?: string[];
	dietaryOptions?: ('vegetarian' | 'halal' | 'vegan')[];
}

export interface QueueStatus {
	canteenId: string;
	currentWaitTime: number; // in minutes
	estimatedWaitTime: number; // in minutes
	capacity: 'low' | 'medium' | 'high' | 'full';
	lastUpdated: Date;
	dataPoints: number; // number of recent submissions
}

export interface MTRExit {
	id: string;
	name: string;
	station: string; // 'HKU Station'
	coordinates: {
		lat: number;
		lng: number;
	};
	direction?: string; // 'A1', 'A2', etc.
}

export interface MTRExitStatus {
	exitId: string;
	crowdDensity: 'low' | 'medium' | 'high';
	elevatorAvailable: boolean;
	escalatorAvailable: boolean;
	lastUpdated: Date;
}


