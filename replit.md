# Overview

This is a Smart MBU Transport System - a modern web application designed specifically for Mbarara University students to book rides, track auto-rickshaws in real-time, and access transparent pricing. The system features a React frontend with TypeScript, an Express.js backend, and uses Drizzle ORM for database management with PostgreSQL.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for development and production builds

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Development**: tsx for TypeScript execution
- **Storage**: In-memory storage with interface for future database integration
- **API Design**: RESTful endpoints with proper error handling

## Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Type-safe database schema with Zod validation
- **Tables**: Users, drivers, rides, and feedback
- **Migrations**: Managed through drizzle-kit

## Key Features
- **Real-time Tracking**: Live auto location updates with 5-second polling
- **Ride Booking**: Form-based booking with fare calculation
- **Driver Dashboard**: Authentication and ride management
- **Admin Analytics**: System metrics and demand analytics
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Interactive Maps**: Leaflet.js integration for real-time vehicle tracking

## Component Architecture
- **UI Components**: Reusable shadcn/ui components
- **Pages**: Route-based page components
- **Custom Components**: Specialized components like LeafletMap and BookingModal
- **Hooks**: Custom React hooks for mobile detection and toast notifications

## Data Flow
- **Client-Server Communication**: HTTP REST API with JSON payloads
- **State Synchronization**: TanStack Query for caching and background updates
- **Form Handling**: React Hook Form with Zod validation
- **Real-time Updates**: Polling-based updates for live data

## Security & Validation
- **Input Validation**: Zod schemas for runtime type checking
- **Authentication**: Driver authentication system
- **CORS**: Configured for cross-origin requests
- **Error Handling**: Centralized error management with user-friendly messages

# External Dependencies

## Core Technologies
- **Neon Database**: PostgreSQL hosting service (@neondatabase/serverless)
- **Leaflet**: Open-source map library for interactive maps
- **OpenStreetMap**: Tile provider for map rendering

## UI & Styling
- **Radix UI**: Unstyled, accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Class Variance Authority**: Utility for creating component variants

## Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **Drizzle Kit**: Database migration and introspection tool
- **ESBuild**: JavaScript bundler for production builds

## Runtime Libraries
- **TanStack Query**: Server state management
- **React Hook Form**: Form state management
- **Wouter**: Lightweight router for React
- **Date-fns**: Date utility library
- **Embla Carousel**: Carousel component library

## Backend Dependencies
- **Express**: Web framework for Node.js
- **Zod**: TypeScript-first schema validation
- **Drizzle ORM**: Type-safe database toolkit
- **Connect-pg-simple**: PostgreSQL session store

## Development Environment
- **Replit**: Cloud development environment with specialized plugins
- **PostCSS**: CSS processing with Autoprefixer
- **ESLint/Prettier**: Code formatting and linting (implicitly configured)