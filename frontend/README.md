# Tazkarti - Egyptian Premier League Match Reservation System

This is a React-based frontend for the Tazkarti Match Reservation System. It simulates a full-stack application with a mock backend service.

## Features

### User Roles
- **Guest**: View matches, register, login.
- **Fan**: Book tickets, select specific seats in VIP lounge, view/cancel reservations, edit profile.
- **Manager**: Create matches, edit match details, add new stadiums, view seat occupancy.
- **Admin**: Approve or reject new manager accounts.

### Key Functionalities
- **Visual Seat Selection**: Interactive stadium map to choose seats.
- **Real-time Updates**: Simulated polling to show seat availability changes.
- **Reservation Conflict Handling**: Prevents double booking of seats.
- **3-Day Cancellation Policy**: Enforces cancellation rules.
- **Role-Based Access Control**: Protected routes and UI elements based on user role.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser at the URL shown in the terminal (usually http://localhost:5173).

## Demo Credentials

The application comes with pre-loaded demo users:

| Role | Username | Password |
|------|----------|----------|
| **Admin** | `admin` | `admin123` |
| **Manager** | `manager1` | `manager123` |
| **Fan** | `fan1` | `fan123` |

## Project Structure

- `/src/components`: Reusable UI components
- `/src/context`: React Context for state management (Auth, Reservation)
- `/src/data`: Mock data for teams, stadiums, matches, users
- `/src/pages`: Application pages organized by role
- `/src/services`: Simulated API layer

## Technologies

- React 18
- React Router v6
- Vite
- Vanilla CSS (Custom Design System)
