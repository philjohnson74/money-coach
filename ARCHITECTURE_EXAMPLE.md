# Practical Architecture Example for Money Coach

This document shows a practical implementation of recommended React Native patterns for the Money Coach app.

## Recommended Structure

```
app/
├── features/
│   ├── transactions/
│   │   ├── components/
│   │   │   ├── TransactionCard.tsx
│   │   │   ├── TransactionList.tsx
│   │   │   └── TransactionForm.tsx
│   │   ├── screens/
│   │   │   ├── TransactionsScreen.tsx
│   │   │   └── TransactionDetailScreen.tsx
│   │   ├── hooks/
│   │   │   ├── useTransactions.ts
│   │   │   ├── useTransactionForm.ts
│   │   │   └── useTransactionDetail.ts
│   │   ├── services/
│   │   │   └── transactionService.ts
│   │   └── types.ts
│   │
│   ├── accounts/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── hooks/
│   │   └── services/
│   │
│   └── budgets/
│       └── ...
│
├── shared/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── Button.test.tsx
│   │   ├── Input/
│   │   ├── Card/
│   │   └── LoadingSpinner/
│   │
│   ├── hooks/
│   │   ├── useApi.ts          # Generic API hook
│   │   ├── useAuth.ts         # Authentication hook
│   │   └── useDebounce.ts     # Utility hook
│   │
│   ├── services/
│   │   ├── api.ts             # API client
│   │   └── storage.ts         # AsyncStorage wrapper
│   │
│   ├── utils/
│   │   ├── formatters.ts      # Date, currency formatters
│   │   ├── validators.ts      # Form validation
│   │   └── constants.ts       # App constants
│   │
│   └── types/
│       └── index.ts           # Shared types
│
├── navigation/
│   ├── AppNavigator.tsx
│   ├── types.ts
│   └── screens.ts
│
├── contexts/
│   └── AppContext.tsx         # Global app context (optional)
│
└── App.tsx
```

## Example Implementation

### 1. Custom Hook Pattern (Business Logic)

```typescript
// app/features/transactions/hooks/useTransactions.ts
import { useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';
import { Transaction } from '../types';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction = await transactionService.create(transaction);
      setTransactions(prev => [newTransaction, ...prev]);
      return newTransaction;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return {
    transactions,
    isLoading,
    error,
    loadTransactions,
    addTransaction,
  };
};
```

### 2. Presenter Component (Pure UI)

```typescript
// app/features/transactions/components/TransactionList.tsx
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { TransactionCard } from './TransactionCard';
import { Transaction } from '../types';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  onTransactionPress: (id: string) => void;
  onRefresh?: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  isLoading,
  onTransactionPress,
  onRefresh,
}) => {
  if (isLoading && transactions.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionCard
            transaction={item}
            onPress={() => onTransactionPress(item.id)}
          />
        )}
        onRefresh={onRefresh}
        refreshing={isLoading && transactions.length > 0}
        ListEmptyComponent={<EmptyState />}
      />
    </View>
  );
};

const EmptyState = () => (
  <View style={styles.empty}>
    <Text>No transactions yet</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  empty: { padding: 20, alignItems: 'center' },
});
```

### 3. Container/Screen (Connects Hook to UI)

```typescript
// app/features/transactions/screens/TransactionsScreen.tsx
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { TransactionList } from '../components/TransactionList';
import { useTransactions } from '../hooks/useTransactions';

export const TransactionsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { transactions, isLoading, loadTransactions } = useTransactions();

  const handleTransactionPress = (id: string) => {
    navigation.navigate('TransactionDetail', { id });
  };

  return (
    <TransactionList
      transactions={transactions}
      isLoading={isLoading}
      onTransactionPress={handleTransactionPress}
      onRefresh={loadTransactions}
    />
  );
};
```

### 4. Service Layer (API Calls)

```typescript
// app/features/transactions/services/transactionService.ts
import { apiService } from '../../../shared/services/api';
import { Transaction } from '../types';

export const transactionService = {
  getAll: async (): Promise<Transaction[]> => {
    return apiService.getTransactions();
  },

  getById: async (id: string): Promise<Transaction> => {
    return apiService.request(`/api/v1/transactions/${id}`);
  },

  create: async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
    return apiService.createTransaction(transaction);
  },

  update: async (id: string, transaction: Partial<Transaction>): Promise<Transaction> => {
    return apiService.request(`/api/v1/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiService.request(`/api/v1/transactions/${id}`, {
      method: 'DELETE',
    });
  },
};
```

### 5. Shared API Service

```typescript
// app/shared/services/api.ts
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your-api.run.app';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async getTransactions() {
    return this.request('/api/v1/transactions');
  }

  async createTransaction(transaction: any) {
    return this.request('/api/v1/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }
}

export const apiService = new ApiService();
```

### 6. Types

```typescript
// app/features/transactions/types.ts
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

export interface TransactionFormData {
  amount: string;
  description: string;
  category: string;
  date: Date;
  type: 'income' | 'expense';
}
```

## Benefits of This Structure

1. **Separation of Concerns**
   - UI components are pure and testable
   - Business logic is in hooks
   - API calls are in services

2. **Reusability**
   - Shared components can be used across features
   - Hooks can be composed together
   - Services can be extended

3. **Testability**
   - Test hooks independently
   - Test components with mock data
   - Test services with mock API

4. **Scalability**
   - Easy to add new features
   - Clear boundaries between features
   - Shared code is centralized

5. **Type Safety**
   - TypeScript throughout
   - Types defined per feature
   - Shared types in shared folder

## Migration Path

If you want to refactor your current app:

1. **Start with one feature** (e.g., transactions)
2. **Extract hooks** from component logic
3. **Create service layer** for API calls
4. **Split components** into presenters
5. **Move to feature folders** gradually
6. **Extract shared components** as you go

This approach allows incremental refactoring without breaking existing code.

