export type AlertType =
	| 'seat-available'
	| 'waitlist-update'
	| 'venue-change'
	| 'time-change'
	| 'class-cancelled'
	| 'exam-update'
	| 'deadline-approaching'
	| 'other';

export interface Alert {
	id: string;
	type: AlertType;
	title: string;
	message: string;
	priority: 'low' | 'normal' | 'high' | 'urgent';
	read: boolean;
	createdAt: Date;
	actionUrl?: string;
	actionLabel?: string;
	relatedCourse?: string;
	relatedSection?: string;
}

export interface NotificationPreferences {
	email: boolean;
	push: boolean;
	inApp: boolean;
	alertTypes: {
		[K in AlertType]: boolean;
	};
	quietHours: {
		enabled: boolean;
		start: string; // Format: "HH:MM"
		end: string; // Format: "HH:MM"
	};
	frequencyLimit: number; // max notifications per hour
}


