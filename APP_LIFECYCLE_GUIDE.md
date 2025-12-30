# React Native App Lifecycle & State Persistence Guide

## Do You Need to Handle Backgrounding?

**Short answer:** It depends on what state you're storing, but **yes, you should handle it** for important data.

## Understanding App Lifecycle

When a user backgrounds your React Native app, several things can happen:

### 1. **App Goes to Background (Not Killed)**
- App stays in memory
- **In-memory state is preserved** ✅
- React state, hooks, variables all remain
- When user returns, app resumes instantly

### 2. **App Gets Killed by OS**
- Low memory situations
- User swipes away from app switcher
- OS needs resources
- **All in-memory state is lost** ❌
- App restarts from scratch when reopened

### 3. **App Gets Killed by User**
- Force quit
- Restart device
- **All in-memory state is lost** ❌

## What State Needs Persistence?

### ✅ **Must Persist** (Critical Data)
- User authentication tokens
- User preferences/settings
- Form data (draft transactions)
- Offline data/cache
- App configuration

### ⚠️ **Should Persist** (Important Data)
- Recent transactions (for offline access)
- Account balances
- User profile data
- Navigation state (optional)

### ❌ **Don't Need to Persist** (Temporary State)
- Loading states
- UI state (modals, dropdowns)
- Animation states
- Temporary form validation errors

## React Native AppState API

React Native provides `AppState` to detect when your app goes to background/foreground:

```typescript
import { AppState, AppStateStatus } from 'react-native';

function App() {
  const [appState, setAppState] = useState(AppState.currentState);
  
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground
        console.log('App has come to the foreground!');
        // Refresh data, sync with server, etc.
      } else if (nextAppState.match(/inactive|background/)) {
        // App has gone to the background
        console.log('App has gone to the background');
        // Save important state, pause timers, etc.
      }
      
      setAppState(nextAppState);
    });
    
    return () => {
      subscription.remove();
    };
  }, [appState]);
  
  return <YourApp />;
}
```

### AppState Values

- `active` - App is running in foreground
- `background` - App is in background
- `inactive` - Transitioning (iOS only, usually brief)

## State Persistence Solutions

### 1. **AsyncStorage** (Simple Key-Value Storage)

**Best for:** User preferences, simple data, non-sensitive info

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save data
await AsyncStorage.setItem('userPreferences', JSON.stringify({
  theme: 'dark',
  currency: 'USD',
}));

// Load data
const data = await AsyncStorage.getItem('userPreferences');
const preferences = data ? JSON.parse(data) : null;

// Remove data
await AsyncStorage.removeItem('userPreferences');
```

**Limitations:**
- Not encrypted (don't store sensitive data)
- Size limit (~6MB on iOS, ~10MB on Android)
- Async operations (use try/catch)

### 2. **Expo SecureStore** (Encrypted Storage)

**Best for:** Authentication tokens, sensitive data

```typescript
import * as SecureStore from 'expo-secure-store';

// Save (encrypted)
await SecureStore.setItemAsync('authToken', 'your-token-here');

// Load (decrypted)
const token = await SecureStore.getItemAsync('authToken');

// Delete
await SecureStore.deleteItemAsync('authToken');
```

**Benefits:**
- Encrypted storage
- Secure for sensitive data
- Built into Expo

### 3. **React Query / TanStack Query** (Automatic Caching)

**Best for:** API data caching, automatic persistence

```typescript
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Automatically caches and persists API data
const { data: transactions } = useQuery({
  queryKey: ['transactions'],
  queryFn: () => fetchTransactions(),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### 4. **Redux Persist** (State Management Persistence)

**Best for:** Persisting entire Redux store

```typescript
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
```

## Practical Example: Money Coach App

### Example 1: Persist User Preferences

```typescript
// hooks/useUserPreferences.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserPreferences {
  theme: 'light' | 'dark';
  currency: string;
  notificationsEnabled: boolean;
}

const STORAGE_KEY = 'userPreferences';
const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  currency: 'USD',
  notificationsEnabled: true,
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
  }, []);
  
  const loadPreferences = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setPreferences(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save preferences:', error);
      // Revert on error
      setPreferences(preferences);
    }
  };
  
  return {
    preferences,
    isLoading,
    updatePreferences,
  };
}
```

### Example 2: Persist Authentication Token

```typescript
// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'authToken';
const USER_KEY = 'userData';

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load auth state on mount
  useEffect(() => {
    loadAuthState();
  }, []);
  
  const loadAuthState = async () => {
    try {
      const [savedToken, savedUser] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEY),
        SecureStore.getItemAsync(USER_KEY),
      ]);
      
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Failed to load auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const login = async (email: string, password: string) => {
    // ... login logic
    const { token: newToken, user: newUser } = await apiService.login(email, password);
    
    // Save to secure storage
    await Promise.all([
      SecureStore.setItemAsync(TOKEN_KEY, newToken),
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(newUser)),
    ]);
    
    setToken(newToken);
    setUser(newUser);
  };
  
  const logout = async () => {
    // Clear secure storage
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEY),
      SecureStore.deleteItemAsync(USER_KEY),
    ]);
    
    setToken(null);
    setUser(null);
  };
  
  return {
    token,
    user,
    isLoading,
    isAuthenticated: !!token,
    login,
    logout,
  };
}
```

### Example 3: Save Draft Transactions

```typescript
// hooks/useTransactionDraft.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';

const DRAFT_KEY = 'transactionDraft';

export function useTransactionDraft() {
  const [draft, setDraft] = useState<TransactionFormData | null>(null);
  
  // Load draft on mount
  useEffect(() => {
    loadDraft();
  }, []);
  
  // Save draft when app goes to background
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState.match(/inactive|background/)) {
        saveDraft();
      }
    });
    
    return () => subscription.remove();
  }, [draft]);
  
  const loadDraft = async () => {
    try {
      const data = await AsyncStorage.getItem(DRAFT_KEY);
      if (data) {
        setDraft(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  };
  
  const saveDraft = async () => {
    if (!draft) return;
    
    try {
      await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };
  
  const clearDraft = async () => {
    setDraft(null);
    try {
      await AsyncStorage.removeItem(DRAFT_KEY);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  };
  
  return {
    draft,
    setDraft,
    clearDraft,
  };
}
```

### Example 4: Sync Data When App Returns to Foreground

```typescript
// hooks/useAppStateSync.ts
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useAppStateSync(onForeground: () => void) {
  const appState = useRef(AppState.currentState);
  
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      // App came to foreground
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        onForeground();
      }
      
      appState.current = nextAppState;
    });
    
    return () => {
      subscription.remove();
    };
  }, [onForeground]);
}

// Usage in component
function TransactionsScreen() {
  const { loadTransactions } = useTransactions();
  
  // Refresh data when app comes to foreground
  useAppStateSync(() => {
    loadTransactions();
  });
  
  // ... rest of component
}
```

## Complete App Setup with Persistence

```typescript
// App.tsx
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useAuth } from './hooks/useAuth';
import { useUserPreferences } from './hooks/useUserPreferences';

export default function App() {
  const { loadAuthState } = useAuth();
  const { loadPreferences } = useUserPreferences();
  
  useEffect(() => {
    // Load persisted state on app start
    loadAuthState();
    loadPreferences();
  }, []);
  
  useEffect(() => {
    // Handle app state changes
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        // App came to foreground - refresh data
        console.log('App is active');
      } else if (nextAppState.match(/inactive|background/)) {
        // App went to background - save important state
        console.log('App is in background');
      }
    });
    
    return () => subscription.remove();
  }, []);
  
  return <YourAppContent />;
}
```

## Best Practices

### 1. **What to Persist**
- ✅ User authentication
- ✅ User preferences
- ✅ Draft form data
- ✅ Offline cache
- ❌ Loading states
- ❌ UI state (modals, etc.)

### 2. **When to Save**
- **On change**: Save immediately when user makes changes
- **On background**: Save when app goes to background
- **On unmount**: Save when component unmounts

### 3. **Error Handling**
Always wrap storage operations in try/catch:

```typescript
try {
  await AsyncStorage.setItem(key, value);
} catch (error) {
  console.error('Storage error:', error);
  // Handle gracefully - maybe show user a message
}
```

### 4. **Performance**
- Don't persist everything (only important data)
- Use debouncing for frequent saves
- Consider background sync for API data

### 5. **Security**
- Use `SecureStore` for sensitive data (tokens, passwords)
- Use `AsyncStorage` for non-sensitive data (preferences)
- Never store passwords in plain text

## Installation

For Expo projects:

```bash
# AsyncStorage
npx expo install @react-native-async-storage/async-storage

# SecureStore (built into Expo)
# No installation needed
```

For bare React Native:

```bash
npm install @react-native-async-storage/async-storage
```

## Testing App Lifecycle

### Simulate Backgrounding (iOS Simulator)
1. Press `Cmd + Shift + H` (home button)
2. Or use Device → Home in simulator menu

### Simulate Backgrounding (Android Emulator)
1. Press home button
2. Or use back button to minimize

### Test State Persistence
1. Enter some data in your app
2. Background the app
3. Kill the app (swipe away or force quit)
4. Reopen the app
5. Verify data is still there

## Summary

**Do you need to handle backgrounding?**

**Yes, for important data:**
- ✅ Authentication tokens → Use SecureStore
- ✅ User preferences → Use AsyncStorage
- ✅ Draft data → Use AsyncStorage
- ✅ Offline cache → Use AsyncStorage or React Query

**No, for temporary state:**
- ❌ Loading states
- ❌ UI state
- ❌ Animation states

**Key Takeaways:**
1. In-memory state is preserved when backgrounded (not killed)
2. State is lost when app is killed
3. Use `AppState` API to detect lifecycle changes
4. Persist important data with AsyncStorage or SecureStore
5. Refresh data when app returns to foreground

Your app will feel more robust and user-friendly when you handle state persistence properly!

