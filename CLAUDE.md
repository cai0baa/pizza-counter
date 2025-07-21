# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React application called "Pizza Counter" - a fun competition tracking app for pizza eating contests. The app allows users to track how many pizza slices each participant consumes, manage penalties, and export results to WhatsApp.

## Commands

### Development
- `npm start` - Run development server (opens http://localhost:3000)
- `npm test` - Run tests in watch mode
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App (one-way operation)

### Testing
- `npm test` - Launches Jest test runner
- Tests are located alongside components (e.g., `App.test.js`)

## Architecture

### Core Structure
- **Entry Point**: `src/index.js` renders the App component with React.StrictMode
- **Main App**: `src/App.js` is a simple wrapper that renders the PizzaCounter component
- **Core Component**: `src/PizzaCounter.jsx` contains all the main application logic

### Key Features in PizzaCounter Component
- **State Management**: Uses React hooks (useState) to manage participants, form state
- **Participant Management**: Add/remove participants, track pizza slice counts
- **Penalty System**: Mark participants who "left pieces" with visual indicators
- **Real-time Leaderboard**: Automatically sorts participants by count, highlights leader
- **WhatsApp Integration**: Generates formatted messages with rankings and humorous commentary
- **Responsive Design**: Grid layout that adapts to different screen sizes

### UI Framework
- **Styling**: Uses Tailwind CSS (v4.1.11) for styling
- **Icons**: Lucide React for iconography (Pizza, Plus, Minus, UserPlus, Trophy, etc.)
- **Design System**: Orange/red color scheme, animated elements, card-based layout

### Data Structure
Participants are stored as objects with:
```javascript
{
  id: number,        // Unique identifier (timestamp)
  name: string,      // Participant name
  count: number,     // Pizza slices consumed
  leftPieces: boolean // Penalty flag
}
```

### Notable Implementation Details
- Uses Tailwind classes directly in JSX (no separate CSS files beyond index.css)
- No Tailwind config file present - likely using default configuration
- WhatsApp export feature uses Web API and clipboard API
- Component uses Portuguese text and Brazilian locale formatting
- Responsive grid: 1 column (mobile) → 2 columns (md) → 3 columns (lg)