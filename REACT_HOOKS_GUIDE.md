# React Hooks Guide

## What is a React Hook?

A **React Hook** is a special function that lets you "hook into" React features like state and lifecycle methods. Hooks allow you to use state and other React features in **function components** (instead of only in class components).

### The Problem Before Hooks

Before hooks (React 16.8, 2019), you had two types of components:

1. **Function Components** - Simple, but couldn't use state or lifecycle methods
2. **Class Components** - Could use state and lifecycle, but more verbose

```typescript
// Old way: Function component (no state)
function App() {
  return <Text>Hello</Text>;
}

// Old way: Class component (with state - verbose!)
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }
  
  componentDidMount() {
    // Lifecycle method
  }
  
  render() {
    return <Text>{this.state.count}</Text>;
  }
}
```

### The Solution: Hooks

Hooks let function components do everything class components could do, but with simpler syntax:

```typescript
// New way: Function component with hooks (clean!)
function App() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // Lifecycle logic
  }, []);
  
  return <Text>{count}</Text>;
}
```

## Built-in React Hooks

### 1. `useState` - Managing State

**What it does:** Lets you add state to function components.

**Why use it:** Store and update data that changes over time (user input, API data, etc.).

```typescript
import { useState } from 'react';

function Counter() {
  // useState returns [currentValue, setterFunction]
  const [count, setCount] = useState(0);
  
  return (
    <View>
      <Text>Count: {count}</Text>
      <Button 
        title="Increment" 
        onPress={() => setCount(count + 1)} 
      />
    </View>
  );
}
```

**Real example for Money Coach:**
```typescript
function TransactionForm() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Submit transaction...
    setIsSubmitting(false);
  };
  
  return (
    <View>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="Amount"
      />
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
      />
      <Button 
        title="Submit" 
        onPress={handleSubmit}
        disabled={isSubmitting}
      />
    </View>
  );
}
```

### 2. `useEffect` - Side Effects & Lifecycle

**What it does:** Handles side effects (API calls, subscriptions, DOM updates) and lifecycle events.

**Why use it:** Fetch data when component mounts, clean up subscriptions, update when data changes.

```typescript
import { useEffect, useState } from 'react';

function TransactionsScreen() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Runs after component mounts (like componentDidMount)
  useEffect(() => {
    const loadTransactions = async () => {
      setIsLoading(true);
      const data = await fetch('/api/transactions').then(r => r.json());
      setTransactions(data);
      setIsLoading(false);
    };
    
    loadTransactions();
  }, []); // Empty array = run once on mount
  
  if (isLoading) return <Text>Loading...</Text>;
  
  return <TransactionList transactions={transactions} />;
}
```

**Different use cases:**

```typescript
// 1. Run once on mount (componentDidMount)
useEffect(() => {
  // Fetch data
}, []); // Empty dependency array

// 2. Run when dependencies change (componentDidUpdate)
useEffect(() => {
  // Update when userId changes
}, [userId]); // Runs when userId changes

// 3. Cleanup (componentWillUnmount)
useEffect(() => {
  const subscription = subscribe();
  
  return () => {
    subscription.unsubscribe(); // Cleanup
  };
}, []);
```

### 3. `useContext` - Accessing Context

**What it does:** Lets you access React Context values.

**Why use it:** Share data across components without prop drilling.

```typescript
// Create context
const UserContext = createContext();

// Provide context
function App() {
  const [user, setUser] = useState(null);
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <TransactionsScreen />
    </UserContext.Provider>
  );
}

// Use context
function TransactionsScreen() {
  const { user } = useContext(UserContext);
  
  return <Text>Welcome, {user?.name}</Text>;
}
```

### 4. `useRef` - Mutable References

**What it does:** Creates a mutable reference that persists across renders.

**Why use it:** Access DOM elements, store values that don't trigger re-renders.

```typescript
import { useRef } from 'react';

function SearchInput() {
  const inputRef = useRef<TextInput>(null);
  
  const focusInput = () => {
    inputRef.current?.focus();
  };
  
  return (
    <TextInput
      ref={inputRef}
      placeholder="Search transactions..."
    />
  );
}
```

### 5. `useMemo` - Memoized Values

**What it does:** Memoizes expensive calculations.

**Why use it:** Optimize performance by avoiding unnecessary recalculations.

```typescript
function TransactionList({ transactions }) {
  // Only recalculate when transactions change
  const total = useMemo(() => {
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);
  
  return <Text>Total: ${total}</Text>;
}
```

### 6. `useCallback` - Memoized Functions

**What it does:** Memoizes functions to prevent unnecessary re-renders.

**Why use it:** Optimize child components that receive function props.

```typescript
function TransactionsScreen() {
  const [transactions, setTransactions] = useState([]);
  
  // Function is recreated on every render without useCallback
  const handleDelete = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []); // Function reference stays the same
  
  return (
    <TransactionList 
      transactions={transactions}
      onDelete={handleDelete} // Won't cause unnecessary re-renders
    />
  );
}
```

## Custom Hooks - Why Create Your Own?

**Custom hooks** are functions that use other hooks. They let you extract and reuse component logic.

### The Problem: Duplicated Logic

Without custom hooks, you might repeat the same logic in multiple components:

```typescript
// Component 1
function TransactionsScreen() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/transactions')
      .then(r => r.json())
      .then(data => {
        setTransactions(data);
        setIsLoading(false);
      });
  }, []);
  
  // ... rest of component
}

// Component 2 - Same logic repeated!
function AccountsScreen() {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/accounts')
      .then(r => r.json())
      .then(data => {
        setAccounts(data);
        setIsLoading(false);
      });
  }, []);
  
  // ... rest of component
}
```

### The Solution: Custom Hook

Extract the logic into a reusable hook:

```typescript
// Custom hook: useApi.ts
function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetch(url)
      .then(r => r.json())
      .then(data => {
        setData(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [url]);
  
  return { data, isLoading, error };
}

// Now use it in components - much cleaner!
function TransactionsScreen() {
  const { data: transactions, isLoading } = useApi('/api/transactions');
  
  if (isLoading) return <LoadingSpinner />;
  return <TransactionList transactions={transactions} />;
}

function AccountsScreen() {
  const { data: accounts, isLoading } = useApi('/api/accounts');
  
  if (isLoading) return <LoadingSpinner />;
  return <AccountList accounts={accounts} />;
}
```

## Real-World Example: Money Coach Transaction Hook

Here's a complete custom hook for managing transactions:

```typescript
// hooks/useTransactions.ts
import { useState, useEffect, useCallback } from 'react';
import { transactionService } from '../services/transactionService';
import { Transaction } from '../types';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load transactions
  const loadTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Add transaction
  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction = await transactionService.create(transaction);
      setTransactions(prev => [newTransaction, ...prev]);
      return newTransaction;
    } catch (err) {
      throw err;
    }
  }, []);
  
  // Delete transaction
  const deleteTransaction = useCallback(async (id: string) => {
    try {
      await transactionService.delete(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      throw err;
    }
  }, []);
  
  // Load on mount
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);
  
  return {
    transactions,
    isLoading,
    error,
    loadTransactions,
    addTransaction,
    deleteTransaction,
  };
}
```

**Using the hook:**

```typescript
// In your component - super clean!
function TransactionsScreen() {
  const { 
    transactions, 
    isLoading, 
    error,
    addTransaction,
    deleteTransaction,
    loadTransactions 
  } = useTransactions();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  
  return (
    <TransactionList
      transactions={transactions}
      onAdd={addTransaction}
      onDelete={deleteTransaction}
      onRefresh={loadTransactions}
    />
  );
}
```

## Benefits of Using Hooks

### 1. **Reusability**
- Extract logic into custom hooks
- Share logic across components
- Build a library of reusable hooks

### 2. **Separation of Concerns**
- Components focus on rendering
- Business logic lives in hooks
- Easier to test and maintain

### 3. **Cleaner Code**
- Less boilerplate than class components
- Easier to read and understand
- Better TypeScript support

### 4. **Better Organization**
- Group related logic together
- Easier to find and modify code
- Clear data flow

### 5. **Performance**
- `useMemo` and `useCallback` for optimization
- Better control over re-renders
- Easier to identify performance issues

## Common Hook Patterns

### Pattern 1: Data Fetching Hook
```typescript
function useTransactions() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  // ... fetch logic
  return { data, loading };
}
```

### Pattern 2: Form Hook
```typescript
function useTransactionForm() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  // ... validation logic
  return { formData, errors, handleChange, handleSubmit };
}
```

### Pattern 3: Toggle Hook
```typescript
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue(v => !v), []);
  return [value, toggle];
}

// Usage
const [isOpen, toggle] = useToggle();
```

### Pattern 4: Debounce Hook
```typescript
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}

// Usage - search only after user stops typing
const searchTerm = useDebounce(inputValue, 500);
```

## Rules of Hooks

1. **Only call hooks at the top level**
   - Don't call inside loops, conditions, or nested functions
   
2. **Only call hooks from React functions**
   - Function components or custom hooks

```typescript
// ✅ Good
function Component() {
  const [state, setState] = useState(0);
  // ...
}

// ❌ Bad
function Component() {
  if (condition) {
    const [state, setState] = useState(0); // Don't do this!
  }
}
```

## Summary

**What are hooks?**
- Functions that let you use React features in function components
- Built-in hooks: `useState`, `useEffect`, `useContext`, etc.
- Custom hooks: Your own functions that use hooks

**Why use hooks?**
- ✅ Simpler than class components
- ✅ Reusable logic (custom hooks)
- ✅ Better organization
- ✅ Easier to test
- ✅ Better performance control
- ✅ Modern React standard

**When to create custom hooks?**
- When you have logic used in multiple components
- When you want to separate business logic from UI
- When you want to make code more testable
- When you want to build reusable functionality

Hooks are the modern way to write React components and are essential for building maintainable React Native apps!


