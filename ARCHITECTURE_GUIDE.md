# Money Coach Architecture Strategy

This document defines the architectural approach and patterns used in the Money Coach React Native application. It serves as a guide for developers to understand the project structure, coding patterns, and best practices.

## Architecture Overview

Money Coach follows a **Feature-Based Architecture** combined with **Custom Hooks** and **React Context** for state management. This approach provides:

- **Clear separation of concerns** - Business logic separated from UI components
- **Scalability** - Easy to add new features without affecting existing code
- **Testability** - Logic in hooks and services can be tested independently
- **Type safety** - Full TypeScript support throughout the codebase
- **Maintainability** - Consistent patterns make the codebase easier to understand

## Project Structure

```
money-coach/
├── app/                    # App-level configuration (Expo)
├── assets/                 # Images, fonts, and other static assets
├── features/               # Feature-based organization
│   ├── avc/                # AVC feature
│   ├── financial-products/ # Financial products listing feature
│   ├── mortgages/          # Mortgages feature
│   ├── payroll-savings/    # Payroll Savings feature
│   ├── protection/         # Protection feature
│   └── wills/              # Wills feature
├── shared/                 # Shared code across features
│   ├── components/         # Shared UI components
│   ├── contexts/           # React Context providers
│   │   └── EnabledFeaturesContext.tsx
│   ├── hooks/              # Shared custom hooks
│   │   └── useEnabledFeatures.ts
│   ├── services/           # API services and external integrations
│   │   └── http.ts         # Axios-based HTTP client
│   ├── types/              # Shared TypeScript type definitions
│   └── utils/              # Shared utility functions
├── App.tsx                 # Root component with navigation
└── App.test.tsx            # Root component tests
```

## Core Architectural Patterns

### 1. Feature-Based Organization

The codebase is organized by **features** rather than by technical layers. Each feature contains all related code:

- **Components** - UI components specific to the feature
- **Screens** - Screen-level components
- **Hooks** - Custom hooks for feature-specific logic
- **Services** - API calls and data fetching
- **Types** - TypeScript interfaces and types

**Benefits:**
- Features are self-contained and easier to understand
- Reduces coupling between different parts of the app
- Makes it easier for multiple developers to work on different features
- Features can be extracted or refactored independently

**Example:**
```
features/
├── financial-products/
│   ├── components/
│   │   └── FinancialProductGridTile.tsx
│   ├── screens/
│   │   ├── FinancialProductsScreen.tsx
│   │   └── AVCScreen.tsx
│   ├── hooks/
│   │   └── useEnabledFeatures.ts
│   ├── services/
│   │   └── financialProductsService.ts
│   └── types.ts
```

### 2. Custom Hooks Pattern

Business logic is extracted into **custom hooks** rather than embedded in components. This pattern:

- Separates data fetching and state management from UI rendering
- Makes logic reusable across multiple components
- Improves testability (hooks can be tested independently)
- Keeps components focused on presentation

**Example:**
```typescript
// hooks/useEnabledFeatures.ts
export const useEnabledFeatures = (partnerId: string) => {
  const [enabledFeatures, setEnabledFeatures] = useState<EnabledFeatures | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const features = await httpService.getEnabledFeatures(partnerId);
        setEnabledFeatures(features);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    if (partnerId) {
      fetchFeatures();
    }
  }, [partnerId]);

  return { enabledFeatures, isLoading, error };
};
```

**Usage in components:**
```typescript
const FinancialProductsScreen = () => {
  const { enabledFeatures, isLoading } = useEnabledFeatures('partner123');
  // Component focuses on rendering, not data fetching
};
```

### 3. React Context for Global State

For state that needs to be shared across multiple components, we use **React Context API**:

- Provides a clean way to share state without prop drilling
- Suitable for app-wide configuration (e.g., enabled features, user preferences)
- Combined with custom hooks for a clean API

**Example:**
```typescript
// contexts/EnabledFeaturesContext.tsx
const EnabledFeaturesContext = createContext<EnabledFeaturesContextType | undefined>(undefined);

export function EnabledFeaturesProvider({ 
  children, 
  enabledFeatures, 
  isLoading, 
  error 
}: EnabledFeaturesProviderProps) {
  const contextValue = useMemo(
    () => ({ enabledFeatures, isLoading, error }),
    [enabledFeatures, isLoading, error]
  );

  return (
    <EnabledFeaturesContext.Provider value={contextValue}>
      {children}
    </EnabledFeaturesContext.Provider>
  );
}

export function useEnabledFeaturesContext(): EnabledFeaturesContextType {
  const context = useContext(EnabledFeaturesContext);
  if (context === undefined) {
    throw new Error('useEnabledFeaturesContext must be used within an EnabledFeaturesProvider');
  }
  return context;
}
```

**Best Practices:**
- Memoize context values with `useMemo` to prevent unnecessary re-renders
- Provide custom hooks for accessing context (e.g., `useEnabledFeaturesContext`)
- Throw clear errors when context is used outside its provider

### 4. Service Layer Pattern

API calls and external service integrations are abstracted into a **service layer**:

- Centralizes HTTP client configuration
- Provides a consistent interface for API calls
- Makes it easy to mock services in tests
- Handles request/response transformation

**Example:**
```typescript
// Services/http.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';

const httpService: AxiosInstance = axios.create({
  baseURL: 'https://money-coach-api-828818752472.us-central1.run.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface EnabledFeatures {
  [featureName: string]: boolean;
}

export const getEnabledFeatures = async (partnerId: string): Promise<EnabledFeatures> => {
  const response: AxiosResponse<{ partnerId: string; features: Record<string, string> }> = 
    await httpService.get(`/partners/${partnerId}/features`);
  
  const enabledFeatures: EnabledFeatures = {};
  Object.entries(response.data.features).forEach(([key, value]) => {
    enabledFeatures[key] = value === 'enabled';
  });
  
  return enabledFeatures;
};
```

**Benefits:**
- Single source of truth for API configuration
- Type-safe API responses
- Easy to add interceptors for authentication, error handling, etc.
- Services can be easily mocked in tests

### 5. TypeScript-First Approach

The entire codebase uses **TypeScript** for type safety:

- **Interfaces** define contracts for data structures
- **Types** provide type safety for function parameters and return values
- **Readonly props** prevent accidental mutations
- **Strict mode** catches errors at compile time

**Example:**
```typescript
// types/financialProduct.ts
export interface IFinancialProduct {
  id: string;
  name: string;
  screenName: string;
}

// Components/FinancialProductGridTile.tsx
interface FinancialProductGridTileProps {
  readonly name: string;
  readonly onPress: () => void;
}

export function FinancialProductGridTile({ name, onPress }: Readonly<FinancialProductGridTileProps>) {
  // Component implementation
}
```

**Best Practices:**
- Define interfaces for all data structures
- Use `readonly` for props to prevent mutations
- Avoid `any` type - use `unknown` or proper types instead
- Leverage TypeScript's type inference where appropriate

## Navigation Strategy

The app uses **React Navigation** (specifically `@react-navigation/native` with native stack navigator) for navigation:

- **Stack Navigator** - Handles screen transitions and navigation history
- **Type-safe navigation** - Navigation props are typed
- **Header configuration** - Consistent header styling across screens

**Example:**
```typescript
// App.tsx
const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        id="MainStack"
        screenOptions={{
          headerStyle: { backgroundColor: '#000000' },
          headerTintColor: '#FFFFFF',
        }}
      >
        <Stack.Screen 
          name="FinancialProducts" 
          component={FinancialProductsScreen}
          options={{ title: 'Financial Products' }}
        />
        <Stack.Screen name="AVC" component={AVCScreen} />
        {/* Other screens */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## HTTP Client: Axios

The project uses **Axios** as the HTTP client for API calls:

- **Promise-based API** - Clean async/await syntax
- **Request/Response interceptors** - For authentication, error handling, logging
- **Automatic JSON parsing** - No need to manually parse responses
- **Request cancellation** - Cancel requests when components unmount
- **TypeScript support** - Full type safety for requests and responses

**Configuration:**
```typescript
// Services/http.ts
const httpService: AxiosInstance = axios.create({
  baseURL: 'https://money-coach-api-828818752472.us-central1.run.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## Component Design Principles

### 1. Presentational vs. Container Components

- **Presentational Components** - Focus on UI rendering, receive data via props
- **Container Components** - Handle data fetching and business logic, pass data to presentational components

In practice, we combine both patterns:
- Screens act as containers (fetch data, handle navigation)
- Reusable components are presentational (receive props, render UI)

### 2. Props Design

- Use `readonly` for all props to prevent mutations
- Keep props interfaces focused and minimal
- Use TypeScript to enforce prop contracts

### 3. Component Composition

- Build complex UIs from smaller, reusable components
- Use composition over inheritance
- Keep components focused on a single responsibility

## Testing Strategy

The project uses **Jest** and **React Testing Library** for unit testing:

- **Jest** - JavaScript testing framework for running tests and assertions
- **React Testing Library** - Testing utilities for React components that encourage testing user behavior

### Unit Testing

- **Hooks** - Test custom hooks using `@testing-library/react-native`
- **Components** - Test component rendering and user interactions
- **Services** - Mock HTTP calls and test service functions
- **Context** - Test context providers and consumers

**Example:**
```typescript
// hooks/useEnabledFeatures.test.tsx
describe('useEnabledFeatures', () => {
  it('should fetch enabled features on mount', async () => {
    const mockFeatures = { AVC: true, Mortgages: true };
    jest.spyOn(httpService, 'getEnabledFeatures').mockResolvedValue(mockFeatures);
    
    const { result, waitForNextUpdate } = renderHook(() => 
      useEnabledFeatures('partner123')
    );
    
    expect(result.current.isLoading).toBe(true);
    await waitForNextUpdate();
    expect(result.current.enabledFeatures).toEqual(mockFeatures);
  });
});
```

### Best Practices

- Mock external dependencies (API calls, navigation)
- Test user interactions, not implementation details
- Aim for high code coverage on business logic
- Keep tests focused and readable

## State Management Decision Tree

Choose the appropriate state management approach based on scope:

1. **Local Component State** (`useState`)
   - State used only within a single component
   - Example: Form input values, UI toggle states

2. **Custom Hooks** (`useState` + `useEffect`)
   - State and logic shared between a few related components
   - Example: `useEnabledFeatures` hook

3. **React Context**
   - State shared across many components or app-wide
   - Example: Enabled features, user preferences, theme

4. **External State Management** (Future consideration)
   - For complex state with many dependencies
   - Options: Zustand, Redux Toolkit (if needed)

## Code Quality Standards

### SonarCloud Compliance

The project follows SonarCloud code quality standards:

- **Readonly Props** - All component props marked as `readonly`
- **Memoization** - Context values memoized with `useMemo`
- **Type Safety** - No `any` types, proper TypeScript usage
- **No Unused Code** - Remove unused imports, variables, and functions

### Code Organization

- **File Naming** - Use PascalCase for components, camelCase for utilities
- **Import Order** - Group imports: React → Third-party → Local
- **Export Strategy** - Use named exports for utilities, default exports for components (when appropriate)

## Development Workflow

1. **Create Feature Structure**
   - Add screens, components, hooks, and services in appropriate directories
   - Follow the feature-based organization pattern

2. **Define Types First**
   - Create TypeScript interfaces in `types/` directory
   - Use types throughout the feature

3. **Implement Business Logic**
   - Extract logic into custom hooks
   - Keep components focused on rendering

4. **Add Tests**
   - Write tests for hooks and services
   - Test component rendering and interactions

5. **Integrate Navigation**
   - Add screens to the navigation stack in `App.tsx`
   - Configure screen options and headers

## Future Considerations

As the app grows, consider:

- **State Management Library** - If Context becomes unwieldy, consider Zustand or Redux Toolkit
- **Form Management** - For complex forms, consider React Hook Form
- **Caching** - For API responses, consider React Query or SWR
- **Error Boundaries** - Add error boundaries for better error handling
- **Performance Optimization** - Use `React.memo`, `useMemo`, `useCallback` where needed

## Summary

Money Coach follows a **Feature-Based Architecture** with:

- ✅ **Custom Hooks** for business logic
- ✅ **React Context** for global state
- ✅ **Service Layer** for API calls (using Axios)
- ✅ **TypeScript** for type safety
- ✅ **React Navigation** for navigation
- ✅ **Jest and React Testing Library** for unit testing
- ✅ **Component-based** UI design

This architecture provides a solid foundation that scales well, is easy to test, and follows React Native best practices.
