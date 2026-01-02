# Testability and Dependency Injection Guide

## Current Testability Assessment

### ✅ **Well-Testable Code**

1. **React Hooks** (`useEnabledFeatures`)
   - ✅ Can be tested with `renderHook`
   - ✅ Can mock dependencies (`getEnabledFeatures`)
   - ✅ Tests loading, error, and success states

2. **React Context** (`EnabledFeaturesContext`)
   - ✅ Can be tested by rendering provider with test values
   - ✅ Can test error handling (missing provider)
   - ✅ Pure component - easy to test

3. **React Components** (Screens)
   - ✅ Can be tested with React Testing Library
   - ✅ Can mock navigation props
   - ✅ Can test rendering and user interactions

### ⚠️ **Moderately Testable Code**

1. **HTTP Service** (`Services/http.ts`)
   - ⚠️ Direct dependency on `axios` - requires mocking
   - ⚠️ Hard-coded baseURL - harder to test different environments
   - ✅ Can be mocked with `jest.mock()`

2. **App Component**
   - ⚠️ Direct dependency on `useEnabledFeatures` hook
   - ✅ Can be mocked with `jest.mock()`
   - ⚠️ Hard-coded `partnerId` - not easily configurable

### ❌ **Hard-to-Test Code**

Currently, there are no major issues, but we can improve testability with dependency injection.

## Dependency Injection in React Native

### What is Dependency Injection?

**Dependency Injection (DI)** is a design pattern where dependencies are provided to a component/function from the outside, rather than being created or imported directly inside.

### Benefits in React Native:

1. **Easier Testing** - Can inject mock dependencies
2. **Flexibility** - Swap implementations easily
3. **Better Separation of Concerns** - Components don't know about concrete implementations
4. **Easier Refactoring** - Change implementations without touching consumers

### Current Code Issues:

```typescript
// ❌ Hard to test - direct import
import { getEnabledFeatures } from '../Services/http';

export function useEnabledFeatures(partnerId: string) {
    const features = await getEnabledFeatures(partnerId); // Hard to mock
}
```

### Improved with DI:

```typescript
// ✅ Easy to test - dependency injected
export function useEnabledFeatures(
    partnerId: string,
    fetchFeatures: (id: string) => Promise<EnabledFeatures> = getEnabledFeatures
) {
    const features = await fetchFeatures(partnerId); // Can inject mock
}
```

## Recommended Refactoring for Better Testability

### Option 1: Parameter-Based DI (Simplest)

**Best for:** Functions and hooks

```typescript
// hooks/useEnabledFeatures.ts
export function useEnabledFeatures(
    partnerId: string,
    fetchFeatures: (id: string) => Promise<EnabledFeatures> = getEnabledFeatures
): UseEnabledFeaturesResult {
    // Use fetchFeatures instead of getEnabledFeatures
    const features = await fetchFeatures(partnerId);
}
```

**Pros:**
- Simple to implement
- No additional libraries
- Easy to test

**Cons:**
- Requires passing dependencies through component tree
- Can get verbose with many dependencies

### Option 2: Context-Based DI (Recommended for React)

**Best for:** App-wide dependencies

```typescript
// contexts/ServiceContext.tsx
interface ServiceContextType {
    httpService: {
        getEnabledFeatures: (partnerId: string) => Promise<EnabledFeatures>;
    };
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

// In App.tsx
<ServiceContext.Provider value={{ httpService: { getEnabledFeatures } }}>
    <App />
</ServiceContext.Provider>

// In hook
const { httpService } = useContext(ServiceContext);
const features = await httpService.getEnabledFeatures(partnerId);
```

**Pros:**
- Clean separation
- Easy to swap implementations
- Works well with React patterns

**Cons:**
- More setup
- Requires context provider

### Option 3: Factory Pattern

**Best for:** Services with configuration

```typescript
// Services/httpFactory.ts
export function createHttpService(baseURL: string) {
    const http = axios.create({ baseURL });
    
    return {
        getEnabledFeatures: async (partnerId: string): Promise<EnabledFeatures> => {
            // Implementation
        }
    };
}

// In App.tsx
const httpService = createHttpService(process.env.API_URL);
```

**Pros:**
- Configurable
- Easy to create test instances
- Good for services

**Cons:**
- More boilerplate
- Need to pass service around

## Recommended Approach for Money Coach

For this project, I recommend **Option 2 (Context-Based DI)** because:

1. **Already using Context** - You have `EnabledFeaturesContext`
2. **App-wide services** - HTTP service is used throughout
3. **Easy to test** - Can provide mock services in tests
4. **Scalable** - Easy to add more services later

## Implementation Example

### Step 1: Create Service Context

```typescript
// contexts/ServiceContext.tsx
interface HttpService {
    getEnabledFeatures: (partnerId: string) => Promise<EnabledFeatures>;
}

interface ServiceContextType {
    httpService: HttpService;
}

export const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ 
    children, 
    httpService 
}: { 
    children: ReactNode; 
    httpService: HttpService 
}) {
    return (
        <ServiceContext.Provider value={{ httpService }}>
            {children}
        </ServiceContext.Provider>
    );
}

export function useServiceContext() {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error('useServiceContext must be used within ServiceProvider');
    }
    return context;
}
```

### Step 2: Update Hook to Use Context

```typescript
// hooks/useEnabledFeatures.ts
export function useEnabledFeatures(partnerId: string) {
    const { httpService } = useServiceContext();
    // Use httpService.getEnabledFeatures instead of direct import
}
```

### Step 3: Provide Service in App

```typescript
// App.tsx
import { getEnabledFeatures } from './Services/http';

<ServiceProvider httpService={{ getEnabledFeatures }}>
    <EnabledFeaturesProvider ...>
        <NavigationContainer>...</NavigationContainer>
    </EnabledFeaturesProvider>
</ServiceProvider>
```

### Step 4: Test with Mock Service

```typescript
// hooks/useEnabledFeatures.test.tsx
const mockHttpService = {
    getEnabledFeatures: jest.fn(),
};

renderHook(() => useEnabledFeatures('partner123'), {
    wrapper: ({ children }) => (
        <ServiceProvider httpService={mockHttpService}>
            {children}
        </ServiceProvider>
    ),
});
```

## Current Testability Score

| Component | Testability | Notes |
|-----------|-------------|-------|
| `useEnabledFeatures` hook | ⭐⭐⭐⭐ | Can mock `getEnabledFeatures` with `jest.mock()` |
| `EnabledFeaturesContext` | ⭐⭐⭐⭐⭐ | Pure component, easy to test |
| `FinancialProductsScreen` | ⭐⭐⭐⭐ | Can mock context, navigation |
| `App.tsx` | ⭐⭐⭐ | Can mock hook, but hard-coded values |
| `Services/http.ts` | ⭐⭐⭐ | Can mock axios, but hard-coded baseURL |

## Should We Use Dependency Injection?

### ✅ **Yes, for:**
- HTTP services (already partially done with mocking)
- Configuration (baseURL, API keys)
- External services (analytics, storage)
- Complex business logic

### ❌ **No need for:**
- Simple utility functions
- Pure functions
- React hooks that don't have external dependencies
- UI components

## Recommendation

**Current state is acceptable** for testing with mocks, but **adding DI would improve:**
1. Test clarity (explicit dependencies)
2. Flexibility (easy to swap implementations)
3. Maintainability (clear dependencies)

**Priority:** Medium - Current code is testable, but DI would make it cleaner and more maintainable.

## Testing Best Practices

1. **Mock at the boundary** - Mock HTTP calls, not internal logic
2. **Test behavior, not implementation** - Test what users see/do
3. **Use dependency injection** - Makes mocking easier
4. **Keep tests simple** - One assertion per test when possible
5. **Test error cases** - Don't just test happy paths

