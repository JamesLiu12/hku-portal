# HKU Helper Redesign - Comprehensive Plan

## Overview
A modern, user-friendly redesign of the HKU Helper addressing key pain points in course registration, navigation, and campus services. Built with SvelteKit for a responsive, fast, and intuitive experience.

## Core Features

### 1. Course Prerequisite Tree & Local Prerequisite Checks

**Problem:** Students struggle to understand course prerequisites and eligibility before registration.

**Solution:**
- **Visual Prerequisite Tree**: Interactive, hierarchical visualization showing:
  - Required courses (must complete)
  - Recommended courses (optional but beneficial)
  - Corequisite courses (can be taken simultaneously)
  - Credit transfer equivalencies
  
- **Smart Prerequisite Checking**:
  - Real-time validation against student's academic record
  - Color-coded status indicators:
    - ✅ Green: All prerequisites met
    - ⚠️ Yellow: Partially met (some prerequisites pending)
    - ❌ Red: Prerequisites not met
  - Detailed breakdown showing exactly which prerequisites are missing
  
- **Features**:
  - Search courses by code or name
  - Filter by department/faculty
  - Export prerequisite tree as PDF/image
  - Share prerequisite tree link
  - Historical prerequisite data (how requirements changed over years)

**Technical Implementation:**
- Data structure: Graph-based (courses as nodes, prerequisites as edges)
- Visualization: D3.js or vis.js for interactive tree
- Backend: Course catalog API with prerequisite relationships
- Caching: Store prerequisite data locally for offline access

---

### 2. Timetable Builder with Conflict Detection

**Problem:** Current system doesn't help students plan schedules or detect conflicts proactively.

**Solution:**
- **Drag-and-Drop Timetable Builder**:
  - Visual grid layout (Monday-Sunday, 8 AM-10 PM)
  - Add courses by searching or selecting from enrolled courses
  - Drag courses to different time slots to experiment
  - Color-coded by course type (lecture, tutorial, lab)
  
- **Real-time Conflict Detection**:
  - Automatic detection of scheduling conflicts
  - Visual highlighting of overlapping time slots
  - Suggestions for alternative sections
  - Travel time calculator between buildings
  - Minimum break time enforcement (e.g., 15 min between classes)
  
- **Additional Features**:
  - Save multiple timetable scenarios
  - Compare timetables side-by-side
  - Export to calendar (iCal/Google Calendar)
  - Print-friendly view
  - Share timetable with advisors/peers
  - Conflict resolution suggestions (alternative sections)

**Technical Implementation:**
- Frontend: Interactive calendar component (FullCalendar or custom)
- Conflict algorithm: Time interval overlap detection
- Data: Course enrollment API, building location data
- Storage: LocalStorage for draft timetables

---

### 3. Campus Map with Building Search & Simple Directions

**Problem:** Students struggle to find buildings and navigate campus efficiently.

**Solution:**
- **Interactive Campus Map**:
  - Modern map interface (Google Maps or OpenStreetMap)
  - Pin locations for all buildings, canteens, libraries, MTR exits
  - Custom HKU campus layer with accurate building outlines
  
- **Building Search**:
  - Search by building code (e.g., "KK", "MB")
  - Search by building name
  - Filter by building type (academic, residential, dining, etc.)
  - Quick access to popular locations (Main Library, Student Centre, etc.)
  
- **Simple Directions**:
  - Point-to-point navigation
  - Step-by-step walking directions
  - Estimated walking time
  - Accessibility routes (wheelchair-friendly paths)
  - Integration with timetable (directions to next class)
  
- **Additional Features**:
  - Building information popup (name, facilities, hours)
  - Indoor maps for major buildings (if available)
  - Save favorite locations
  - Share location/link
  - AR mode (future enhancement)

**Technical Implementation:**
- Map library: Leaflet.js or Google Maps API
- Geocoding: Building coordinates database
- Routing: Custom routing algorithm or Google Directions API
- Data: HKU campus GIS data

---

### 4. Queue Times for Canteens and MTR Exits

**Problem:** Students waste time queuing at canteens and don't know MTR exit conditions.

**Solution:**
- **Real-time Queue Monitoring**:
  - Live queue time estimates for all canteens
  - Historical data (peak hours, average wait times)
  - Capacity indicators (how busy each canteen is)
  - Special alerts (closed, maintenance, special events)
  
- **Canteen Features**:
  - Filter by location (Main Campus, JCSV, etc.)
  - Menu information (if available)
  - Operating hours
  - Dietary filters (vegetarian, halal, etc.)
  - Estimated wait time for specific times (e.g., "Expected wait at 12:30 PM: 15 minutes")
  
- **MTR Exit Information**:
  - Real-time crowd density at each exit
  - Historical patterns (rush hour times)
  - Suggested exits based on destination
  - Elevator/escalator availability
  - Accessibility information
  
- **Data Collection**:
  - User-submitted wait times (with verification)
  - IoT sensors (if available)
  - Historical pattern analysis
  
**Technical Implementation:**
- Real-time updates: WebSocket or polling
- Data aggregation: Average of recent submissions
- Storage: Time-series database for historical data
- Machine learning: Predict future queue times

---

### 5. Alerts for Seat Changes and Timetable Updates

**Problem:** Students miss important updates about course availability and schedule changes.

**Solution:**
- **Smart Notification System**:
  - Real-time push notifications
  - Email notifications (optional)
  - In-app notification center
  - Browser notifications
  
- **Alert Types**:
  - **Seat Availability**:
    - Alert when seat opens in waitlisted course
    - Alert when new section added
    - Alert when enrollment deadline approaching
    - Alert when course capacity increases
  
  - **Timetable Updates**:
    - Venue changes
    - Time changes
    - Cancelled classes
    - Added make-up classes
    - Exam schedule updates
  
- **Notification Preferences**:
  - Customize which alerts to receive
  - Set quiet hours
  - Priority levels (urgent, normal, low)
  - Frequency limits (don't spam)
  
- **Additional Features**:
  - Alert history
  - Mark as read/unread
  - Archive old notifications
  - Bulk actions
  - Notification digest (daily/weekly summary)

**Technical Implementation:**
- Backend: WebSocket server for real-time updates
- Database: Notification queue system
- Push notifications: Service Worker + Push API
- Email: SMTP service (SendGrid, etc.)

---

## Technical Architecture

### Frontend Stack
- **Framework**: SvelteKit 5 (already set up)
- **UI Components**: Custom components with modern design
- **Styling**: Tailwind CSS (recommended) or CSS modules
- **State Management**: Svelte stores
- **Charts/Visualizations**: D3.js, vis.js, or Chart.js
- **Maps**: Leaflet.js or Google Maps API

### Backend Requirements
- **API**: RESTful API or GraphQL
- **Real-time**: WebSocket server (Socket.io)
- **Database**: PostgreSQL or MongoDB
- **Caching**: Redis for queue times and frequently accessed data
- **Authentication**: HKU SSO integration

### Data Sources
- **Course Data**: SIS API (Student Information System)
- **Campus Map**: HKU GIS data or manual mapping
- **Queue Times**: User submissions + IoT sensors
- **Notifications**: SIS integration + custom alert system

---

## Project Structure

```
src/
├── routes/
│   ├── (auth)/
│   │   └── login/
│   ├── courses/
│   │   ├── prerequisites/
│   │   └── search/
│   ├── timetable/
│   │   ├── builder/
│   │   └── conflicts/
│   ├── map/
│   │   ├── search/
│   │   └── directions/
│   ├── queue/
│   │   ├── canteens/
│   │   └── mtr/
│   └── alerts/
│       ├── notifications/
│       └── settings/
├── lib/
│   ├── components/
│   │   ├── CoursePrerequisiteTree.svelte
│   │   ├── TimetableBuilder.svelte
│   │   ├── CampusMap.svelte
│   │   ├── QueueMonitor.svelte
│   │   └── AlertCenter.svelte
│   ├── stores/
│   │   ├── courses.ts
│   │   ├── timetable.ts
│   │   ├── map.ts
│   │   ├── queue.ts
│   │   └── alerts.ts
│   ├── utils/
│   │   ├── conflictDetection.ts
│   │   ├── prerequisiteValidation.ts
│   │   ├── routeCalculator.ts
│   │   └── notificationService.ts
│   └── types/
│       ├── course.ts
│       ├── timetable.ts
│       └── notification.ts
└── app.d.ts
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
- Set up project structure
- Create base layout with navigation
- Implement authentication/SSO integration
- Set up API structure

### Phase 2: Core Features (Week 3-6)
1. Course Prerequisite Tree (Week 3)
2. Timetable Builder (Week 4)
3. Campus Map (Week 5)
4. Queue Times (Week 6)

### Phase 3: Alerts & Polish (Week 7-8)
- Alert system
- Notifications
- UI/UX improvements
- Performance optimization

### Phase 4: Testing & Launch (Week 9-10)
- User testing
- Bug fixes
- Documentation
- Deployment

---

## Design Principles

1. **Mobile-First**: Responsive design for all screen sizes
2. **Accessibility**: WCAG 2.1 AA compliance
3. **Performance**: Fast load times, optimized assets
4. **User-Centric**: Intuitive navigation, clear information hierarchy
5. **Modern Aesthetics**: Clean, minimalist design with HKU branding
6. **Offline Support**: Key features work offline (PWA)

---

## Success Metrics

- **User Engagement**: 
  - Daily active users
  - Feature usage rates
  - Time spent on platform

- **User Satisfaction**:
  - User feedback scores
  - Support ticket reduction
  - Feature adoption rates

- **Performance**:
  - Page load times < 2 seconds
  - API response times < 500ms
  - 99.9% uptime

---

## Future Enhancements

- AI-powered course recommendations
- Integration with external services (Google Calendar, etc.)
- Social features (study groups, class discussions)
- Mobile app (React Native or native)
- AR campus navigation
- Voice assistant integration
- Multi-language support (English, Traditional Chinese, Simplified Chinese)


