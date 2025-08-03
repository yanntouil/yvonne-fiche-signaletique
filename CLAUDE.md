# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React TypeScript application called "Fiche Signalétique" - a form management system that allows users to create, manage, and organize multiple forms with persistent data storage. The app can run as a web application, PWA, or Electron desktop app.

## Key Commands

### Development
- `npm run dev` - Start Vite development server
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint (fails on warnings)

### Electron Desktop App
- `npm run build-electron` - Build Electron main process
- `npm start` - Build and start Electron app

## Architecture

### Technology Stack
- **React 18** with TypeScript for UI
- **Vite** for bundling and dev server
- **Tailwind CSS** + **Shadcn/UI** for styling
- **@dnd-kit** for drag-and-drop functionality
- **Electron** for desktop app packaging
- **vite-plugin-pwa** for PWA support

### Code Structure
- `src/App.tsx` - Main application entry point with form state management
- `src/components/Entete.tsx` - Header component with form list management
- `src/components/Formulaire.tsx` - Main form component with all form fields
- `src/components/ui/` - Shadcn/UI component library
- `src/hooks/usePersistedState.ts` - Custom hook for localStorage persistence
- `src/lib/utils.ts` - Utility functions (mainly for className merging)

### Data Model
Forms are stored as an array of `FicheSignaletique` objects with:
- Basic info (name, date, email, phone)
- Room payments (`paiementChambres`)
- Baggage services (`bagages`)
- Dinner services (`dinerPayes`)
- Comments and administrative notes

All form data is persisted to localStorage using the `usePersistedState` hook.

## Important Notes

### No Testing Framework
This project currently has no testing setup. When implementing features:
- Manually test in the browser
- Test drag-and-drop functionality
- Verify localStorage persistence
- Check print layout functionality

### Code Style
- Uses Tailwind CSS for styling - avoid inline styles
- Components use Shadcn/UI patterns
- TypeScript strict mode is enabled
- ESLint is configured to fail on warnings

### Form Management
- Forms are managed via `fiches` state array in App.tsx
- Each form has a unique `id` generated with `Date.now()`
- Forms can be reordered via drag-and-drop
- Active form is tracked with `ficheActuelle` state

### Printing
The app includes print-specific styles. When modifying the form layout, test the print preview to ensure proper formatting.