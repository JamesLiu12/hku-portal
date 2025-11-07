# HKU Helper - Modern Student Portal

A modern, user-friendly redesign of the HKU Helper addressing key pain points in course registration, navigation, and campus services.

## Features

- **Course Prerequisite Tree**: Interactive visualization of course prerequisites with real-time eligibility checking
- **Timetable Builder**: Drag-and-drop timetable builder with automatic conflict detection
- **Campus Map**: Interactive map with building search and step-by-step directions
- **Queue Times**: Real-time wait times for canteens and MTR exit status
- **Smart Alerts**: Notifications for seat availability, timetable changes, and important updates

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, pnpm, or yarn

### Installation

1. Install dependencies:

```sh
npm install
```

2. Install Tailwind CSS PostCSS plugin (required for Tailwind v4):

```sh
npm install -D @tailwindcss/postcss
```

Note: Tailwind CSS v4 is already in package.json. The PostCSS plugin is separate.

3. Start the development server:

```sh
npm run dev

# or start with auto-open browser
npm run dev -- --open
```

## Project Structure

```
src/
├── routes/              # Page routes
│   ├── courses/        # Course prerequisite features
│   ├── timetable/      # Timetable builder
│   ├── map/            # Campus map
│   ├── queue/          # Queue times
│   └── alerts/         # Notifications
├── lib/
│   ├── components/     # Reusable Svelte components
│   ├── stores/         # Svelte stores for state management
│   ├── utils/          # Utility functions
│   └── types/          # TypeScript type definitions
└── app.css             # Global styles with Tailwind
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run Svelte type checking
- `npm run lint` - Lint code

## Architecture

Built with:
- **SvelteKit 5** - Modern web framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Svelte Stores** - State management

## Documentation

See [PLAN.md](./PLAN.md) for comprehensive feature specifications and implementation details.

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.
