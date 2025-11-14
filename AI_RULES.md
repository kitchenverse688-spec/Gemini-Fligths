# AI Development Rules for Gemini Flights

This document outlines the technical stack and coding conventions for the Gemini Flights application. Adhering to these rules ensures consistency, maintainability, and a streamlined development process.

## Tech Stack

The application is built with a modern, lightweight tech stack focused on performance and developer experience.

*   **Framework**: React 19 with TypeScript for building a type-safe, component-based user interface.
*   **Build Tool**: Vite for fast development server startup and optimized production builds.
*   **AI Integration**: Google Gemini (`@google/genai`) is used as the core AI model for generating flight and hotel data.
*   **Styling**: Tailwind CSS is used exclusively for styling. All styles are applied via utility classes directly in the JSX.
*   **Icons**: Font Awesome is used for all icons, accessed via CSS classes.
*   **State Management**: Local component state is managed using React Hooks (`useState`, `useEffect`, `useCallback`).
*   **File Structure**: The application follows a standard structure, separating components, services, types, and constants into their respective directories.
*   **Environment**: Node.js is required for the local development environment.

## Library and Code Architecture Rules

To keep the codebase clean and predictable, please follow these guidelines.

*   **UI Components**: Do not add any new UI component libraries. All components must be built from scratch using JSX and styled with **Tailwind CSS**. This ensures a consistent design and avoids dependency bloat.
*   **Styling**: All styling **must** be done with Tailwind CSS utility classes. Avoid writing custom CSS files or using inline `style` attributes.
*   **State Management**: For now, rely solely on **React's built-in hooks** for state management. Do not introduce state management libraries like Redux or Zustand unless the application's complexity significantly increases.
*   **AI Logic**: All interactions with the Google Gemini API must be centralized within `src/services/geminiService.ts`. This keeps API logic isolated and easy to manage.
*   **Icons**: Use **Font Awesome** for all icons by applying the appropriate classes (e.g., `<i className="fas fa-plane"></i>`). Do not install other icon libraries.
*   **Type Definitions**: All shared TypeScript types and interfaces must be defined in `src/types.ts`. This provides a single source of truth for our data structures.
*   **Constants**: Application-wide constants (e.g., airport codes, currencies, cabin classes) must be stored in `src/constants.ts`.