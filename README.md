# Money Coach

A React Native mobile app built with Expo for managing personal finances on iOS and Android.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI (installed globally or via npx)
- iOS Simulator (for Mac) or Android Studio (for Android development)
- Expo Go app on your phone (for testing on physical devices)

### Installation

1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

2. Start the development server:
```bash
npm start
```

## Running the App

### Development Server

Start the Expo development server:
```bash
npm start
```

This will:
- Start the Metro bundler
- Display a QR code you can scan with Expo Go
- Show options to open in iOS simulator, Android emulator, or web browser

### Platform-Specific Commands

- **iOS Simulator** (Mac only):
  ```bash
  npm run ios
  ```
  Or press `i` in the Expo CLI after running `npm start`

- **Android Emulator**:
  ```bash
  npm run android
  ```
  Or press `a` in the Expo CLI after running `npm start`

- **Web Browser**:
  ```bash
  npm run web
  ```
  Or press `w` in the Expo CLI after running `npm start`

### Running on Physical Device

1. Install the **Expo Go** app on your iOS or Android device
2. Run `npm start` in your terminal
3. Scan the QR code displayed in the terminal with:
   - **iOS**: Use the Camera app
   - **Android**: Use the Expo Go app to scan

## Running Tests

This project uses **Jest** as the testing framework for automated tests, configured with `jest-expo` for React Native compatibility.

### Run All Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

This will:
- Run all test files (files ending in `.test.tsx`, `.test.ts`, `.spec.tsx`, or `.spec.ts`)
- Generate a coverage report showing which code is covered by tests
- Create coverage reports in the `coverage/` directory (HTML, LCOV, and text formats)

### Test Files

Test files should be placed alongside the code they test, using the naming convention:
- `ComponentName.test.tsx` or `ComponentName.test.ts`
- `ComponentName.spec.tsx` or `ComponentName.spec.ts`

Example: `App.test.tsx` tests the `App.tsx` component.

### Writing Tests

Tests are written using Jest and React Native Testing Library. Example:

```typescript
import { render, screen } from '@testing-library/react-native';
import App from './App';

describe('App', () => {
  it('renders the title', () => {
    render(<App />);
    expect(screen.getByText('Money Coach')).toBeTruthy();
  });
});
```

## Project Structure

```
money-coach/
├── App.tsx              # Main app component
├── App.test.tsx         # Tests for App component
├── app.json             # Expo configuration
├── package.json         # Dependencies and scripts
├── jest.config.js       # Jest configuration
├── babel.config.js      # Babel configuration
├── tsconfig.json        # TypeScript configuration
├── assets/              # Images, fonts, and other assets
├── .github/             # GitHub Actions workflows
└── sonar-project.properties  # SonarCloud configuration
```

## Tech Stack

- **Expo** - React Native framework
- **React Native** - Mobile app framework
- **TypeScript** - Type safety
- **React Navigation** - Third-party navigation library for React Native
- **Axios** - Third-party HTTP client for making API calls
- **Jest** - Testing framework
- **React Native Testing Library** - Testing utilities for React Native

## Development

This project uses:
- Expo SDK 54
- React 19.1
- React Native 0.81.5
- TypeScript 5.9
- Jest 29.7

## Code Quality

This project is configured with SonarCloud for code quality analysis. The workflow runs automatically on pushes and pull requests to the main branch.

- **Coverage Requirement**: 80% coverage on new code
- **Test Framework**: Jest with React Native Testing Library
- Coverage reports are generated automatically in CI/CD
