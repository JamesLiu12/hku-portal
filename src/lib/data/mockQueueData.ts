/**
 * Mock queue data for canteens and MTR exits
 */

import type { Canteen, QueueStatus, MTRExit, MTRExitStatus } from '$lib/types/queue';

export const mockCanteens: Canteen[] = [
	{
		id: 'canteen-1',
		name: 'Student Union Canteen',
		nameZh: '學生會餐廳',
		building: 'Composite Building',
		location: 'Main Campus',
		coordinates: { lat: 22.2845, lng: 114.1382 },
		operatingHours: {
			monday: { open: '08:00', close: '21:00' },
			tuesday: { open: '08:00', close: '21:00' },
			wednesday: { open: '08:00', close: '21:00' },
			thursday: { open: '08:00', close: '21:00' },
			friday: { open: '08:00', close: '21:00' },
			saturday: { open: '09:00', close: '20:00' },
			sunday: { open: '09:00', close: '20:00' }
		},
		cuisines: ['Chinese', 'Taiwanese', 'Hong Kong Style'],
		dietaryOptions: ['vegetarian']
	},
	{
		id: 'canteen-2',
		name: 'Coffee Academics',
		nameZh: '咖啡店',
		building: 'Main Library',
		location: 'Main Campus',
		coordinates: { lat: 22.2841, lng: 114.1380 },
		operatingHours: {
			monday: { open: '08:00', close: '18:00' },
			tuesday: { open: '08:00', close: '18:00' },
			wednesday: { open: '08:00', close: '18:00' },
			thursday: { open: '08:00', close: '18:00' },
			friday: { open: '08:00', close: '18:00' },
			saturday: { open: '09:00', close: '17:00' },
			sunday: { open: '09:00', close: '17:00' }
		},
		cuisines: ['Cafe', 'Sandwiches', 'Pastries'],
		dietaryOptions: ['vegetarian', 'vegan']
	},
	{
		id: 'canteen-3',
		name: 'Starbucks',
		nameZh: '星巴克',
		building: 'Composite Building',
		location: 'Main Campus',
		coordinates: { lat: 22.2848, lng: 114.1385 },
		operatingHours: {
			monday: { open: '08:30', close: '22:00' },
			tuesday: { open: '08:30', close: '22:00' },
			wednesday: { open: '08:30', close: '22:00' },
			thursday: { open: '08:30', close: '22:00' },
			friday: { open: '08:30', close: '22:00' },
			saturday: { open: '09:00', close: '21:00' },
			sunday: { open: '09:00', close: '21:00' }
		},
		cuisines: ['Cafe', 'Light Meals'],
		dietaryOptions: ['vegetarian', 'vegan']
	}
];

export const mockMTRExits: MTRExit[] = [
	{
		id: 'exit-a1',
		name: 'HKU Station - Exit A1',
		station: 'HKU Station',
		direction: 'A1',
		coordinates: { lat: 22.2867, lng: 114.1388 }
	},
	{
		id: 'exit-a2',
		name: 'HKU Station - Exit A2',
		station: 'HKU Station',
		direction: 'A2',
		coordinates: { lat: 22.2865, lng: 114.1390 }
	},
	{
		id: 'exit-b1',
		name: 'HKU Station - Exit B1',
		station: 'HKU Station',
		direction: 'B1',
		coordinates: { lat: 22.2869, lng: 114.1386 }
	},
	{
		id: 'exit-b2',
		name: 'HKU Station - Exit B2',
		station: 'HKU Station',
		direction: 'B2',
		coordinates: { lat: 22.2871, lng: 114.1384 }
	},
	{
		id: 'exit-c1',
		name: 'HKU Station - Exit C1',
		station: 'HKU Station',
		direction: 'C1',
		coordinates: { lat: 22.2873, lng: 114.1382 }
	},
	{
		id: 'exit-c2',
		name: 'HKU Station - Exit C2',
		station: 'HKU Station',
		direction: 'C2',
		coordinates: { lat: 22.2875, lng: 114.1380 }
	}
];

/**
 * Generate mock queue status with realistic variations
 */
function generateMockQueueStatus(canteenId: string): QueueStatus {
	const hour = new Date().getHours();
	const minute = new Date().getMinutes();
	const currentTime = hour + minute / 60;
	
	// Peak hours: 12:00-14:00 (lunch), 17:30-19:00 (dinner)
	const isLunchPeak = currentTime >= 12 && currentTime < 14;
	const isDinnerPeak = currentTime >= 17.5 && currentTime < 19;
	const isPeak = isLunchPeak || isDinnerPeak;
	
	// Base wait time varies by canteen and time
	let baseWait = 5;
	if (canteenId === 'canteen-1') baseWait = isPeak ? 18 : 8;
	else if (canteenId === 'canteen-2') baseWait = isPeak ? 12 : 5;
	else if (canteenId === 'canteen-3') baseWait = isPeak ? 20 : 10;
	else if (canteenId === 'canteen-4') baseWait = isPeak ? 15 : 7;
	
	// Add some randomness
	const waitTime = Math.max(2, Math.round(baseWait + (Math.random() - 0.5) * 5));
	
	// Determine capacity
	let capacity: 'low' | 'medium' | 'high' | 'full';
	if (waitTime < 5) capacity = 'low';
	else if (waitTime < 10) capacity = 'medium';
	else if (waitTime < 18) capacity = 'high';
	else capacity = 'full';
	
	return {
		canteenId,
		currentWaitTime: waitTime,
		estimatedWaitTime: waitTime,
		capacity,
		lastUpdated: new Date(),
		dataPoints: Math.floor(Math.random() * 50) + 10
	};
}

/**
 * Generate mock MTR exit status
 */
function generateMockMTRStatus(exitId: string): MTRExitStatus {
	const hour = new Date().getHours();
	const minute = new Date().getMinutes();
	const currentTime = hour + minute / 60;
	
	// Rush hours: 8:00-9:30, 17:30-19:00
	const isMorningRush = currentTime >= 8 && currentTime < 9.5;
	const isEveningRush = currentTime >= 17.5 && currentTime < 19;
	const isRush = isMorningRush || isEveningRush;
	
	// Queue time varies by exit and time of day
	let baseQueueTime = 2;
	if (isRush) {
		baseQueueTime = 8 + Math.random() * 7; // 8-15 minutes during rush
	} else {
		baseQueueTime = 1 + Math.random() * 4; // 1-5 minutes during normal hours
	}
	
	let crowdDensity: 'low' | 'medium' | 'high';
	if (baseQueueTime < 3) {
		crowdDensity = 'low';
	} else if (baseQueueTime < 8) {
		crowdDensity = 'medium';
	} else {
		crowdDensity = 'high';
	}
	
	return {
		exitId,
		estimatedQueueTime: Math.round(baseQueueTime),
		crowdDensity,
		lastUpdated: new Date(),
		dataPoints: Math.floor(Math.random() * 40) + 10
	};
}

/**
 * Get current queue status for all canteens
 */
export function getCanteenQueueStatuses(): Array<Canteen & { queueStatus: QueueStatus }> {
	return mockCanteens.map(canteen => ({
		...canteen,
		queueStatus: generateMockQueueStatus(canteen.id)
	}));
}

/**
 * Get current MTR exit statuses
 */
export function getMTRExitStatuses(): Array<MTRExit & { status: MTRExitStatus }> {
	return mockMTRExits.map(exit => ({
		...exit,
		status: generateMockMTRStatus(exit.id)
	}));
}

/**
 * Get peak hours information
 */
export function getPeakHours(): { start: string; end: string; description: string }[] {
	return [
		{ start: '12:00', end: '14:00', description: 'Lunch Peak' },
		{ start: '17:30', end: '19:00', description: 'Dinner Peak' }
	];
}

/**
 * Estimate wait time at a specific future time
 */
export function estimateFutureWaitTime(
	canteenId: string,
	targetHour: number,
	targetMinute: number
): number {
	const targetTime = targetHour + targetMinute / 60;
	
	const isLunchPeak = targetTime >= 12 && targetTime < 14;
	const isDinnerPeak = targetTime >= 17.5 && targetTime < 19;
	const isPeak = isLunchPeak || isDinnerPeak;
	
	let baseWait = 5;
	if (canteenId === 'canteen-1') baseWait = isPeak ? 18 : 8;
	else if (canteenId === 'canteen-2') baseWait = isPeak ? 12 : 5;
	else if (canteenId === 'canteen-3') baseWait = isPeak ? 20 : 10;
	else if (canteenId === 'canteen-4') baseWait = isPeak ? 15 : 7;
	
	return Math.round(baseWait);
}


