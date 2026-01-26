# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
# Development
npm start              # Start Expo dev server
npm run ios            # Run on iOS (expo run:ios)
npm run android        # Run on Android (expo run:android)
npm run web            # Start web version

# Prebuild (generate native projects)
npm run prebuild       # Generate ios/ and android/ directories
npm run prebuild:clean # Clean prebuild

# Code quality
npm run lint           # Run ESLint
npm run lint:fix       # Auto-fix lint issues

# Production builds
npm run android:dev:build  # EAS build for Android development
```

## Architecture Overview

### Tech Stack
- **Framework:** React Native 0.81.5 with Expo 54 and Expo Router 6
- **State Management:** Zustand (client state) + React Query (server state)
- **Forms:** React Hook Form with Zod validation
- **HTTP:** Axios with interceptors for auth token handling
- **Maps:** expo-maps (AppleMaps on iOS, GoogleMaps on Android)

### Project Structure

```
app/                    # Expo Router file-based routing
├── _layout.tsx         # Root layout with auth guards & QueryClient
├── login.tsx           # Auth screen
└── (tabs)/             # Main tab navigation
    ├── (home)/         # Tour creation & map features
    └── profile.tsx

authentication/         # Auth Zustand store
services/
├── http/               # Axios instances with token refresh logic
└── authentication/     # Auth API + secure storage

hooks/
├── useAiTourStore.ts   # Tour data Zustand store
├── maps/               # Map-related hooks (polylines, proximity, geocoding)
└── generate-tour-with-ai/  # AI tour generation mutation

ui-kit/                 # Reusable UI components (buttons, inputs, layout)
components/             # Platform-specific map components
features/               # Feature modules (userAuth)
```

### Key Patterns

**Authentication Flow:**
- Tokens stored in expo-secure-store
- `http.auth` instance auto-injects Bearer token
- 401 responses trigger automatic token refresh with retry
- Guest mode allows app usage without auth

**UI Component System:**
- `UIView` is the base layout component with theme-based props
- Variants: `UIView`, `UIView.Animated`, `UIView.Pressable`
- Theme tokens in `theme.ts` for colors, spacing, font sizes, border radii

**API Validation:**
- All API responses validated with Zod schemas
- Type-safe through discriminated unions in `services/http/http.ts`

**Platform-Specific Code:**
- Maps: `AppleMapsComponent` (iOS) vs `GoogleMapsComponent` (Android)
- Tabs: `NativeTabs` (iOS) vs `Tabs` (Android) in `(tabs)/_layout.tsx`

### Path Aliases
- `@/*` maps to project root (configured in tsconfig.json)

### Environment Configuration
- Google Maps API key configured in `app.config.js`
- EAS project ID: `0540ce84-4e6b-41e5-9a7c-28cfa05b5755`
