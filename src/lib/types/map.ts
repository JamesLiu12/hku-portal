export interface Building {
	id: string;
	code: string;
	name: string;
	nameZh?: string;
	type: 'academic' | 'residential' | 'dining' | 'library' | 'administrative' | 'other';
	coordinates: {
		lat: number;
		lng: number;
	};
	address?: string;
	facilities?: string[];
	hours?: {
		[day: string]: {
			open: string;
			close: string;
		};
	};
}

export interface MapLocation {
	id: string;
	name: string;
	type: 'building' | 'canteen' | 'mtr-exit' | 'library' | 'other';
	coordinates: {
		lat: number;
		lng: number;
	};
	icon?: string;
}

export interface Route {
	from: MapLocation;
	to: MapLocation;
	steps: RouteStep[];
	distance: number; // in meters
	duration: number; // in seconds
	accessible?: boolean;
}

export interface RouteStep {
	instruction: string;
	distance: number;
	duration: number;
	coordinates: {
		lat: number;
		lng: number;
	};
}


