import React from 'react';
import { View, Text } from 'react-native';
import { render, screen, renderHook } from '@testing-library/react-native';
import { EnabledFeaturesProvider, useEnabledFeaturesContext } from './EnabledFeaturesContext';
import { EnabledFeatures } from '../Services/http';

// Test component that uses the context
function TestComponent(): React.ReactElement {
    const { enabledFeatures, isLoading, error } = useEnabledFeaturesContext();
    
    if (isLoading) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }
    
    if (error) {
        return (
            <View>
                <Text>Error: {error}</Text>
            </View>
        );
    }
    
    return (
        <View>
            <Text>Features: {enabledFeatures?.enabledFeatureNames.join(', ') || ''}</Text>
        </View>
    );
}

describe('EnabledFeaturesContext', () => {
    const mockEnabledFeatures: EnabledFeatures = {
        partnerId: 'partner123',
        enabledFeatureNames: ['Wills', 'Mortgages', 'Protection'],
    };

    it('should provide enabled features to children', () => {
        render(
            <EnabledFeaturesProvider
                enabledFeatures={mockEnabledFeatures}
                isLoading={false}
                error={null}
            >
                <TestComponent />
            </EnabledFeaturesProvider>
        );

        expect(screen.getByText('Features: Wills, Mortgages, Protection')).toBeTruthy();
    });

    it('should provide loading state', () => {
        render(
            <EnabledFeaturesProvider
                enabledFeatures={null}
                isLoading={true}
                error={null}
            >
                <TestComponent />
            </EnabledFeaturesProvider>
        );

        expect(screen.getByText('Loading...')).toBeTruthy();
    });

    it('should provide error state', () => {
        const errorMessage = 'Failed to fetch';
        render(
            <EnabledFeaturesProvider
                enabledFeatures={null}
                isLoading={false}
                error={errorMessage}
            >
                <TestComponent />
            </EnabledFeaturesProvider>
        );

        expect(screen.getByText(`Error: ${errorMessage}`)).toBeTruthy();
    });

    it('should throw error when used outside provider', () => {
        // Suppress console.error for this test
        const originalError = console.error;
        console.error = jest.fn();

        // React Testing Library will catch the error, so we need to check if it throws
        expect(() => {
            render(<TestComponent />);
        }).toThrow('useEnabledFeaturesContext must be used within an EnabledFeaturesProvider');

        console.error = originalError;
    });

    it('should handle null enabled features', () => {
        render(
            <EnabledFeaturesProvider
                enabledFeatures={null}
                isLoading={false}
                error={null}
            >
                <TestComponent />
            </EnabledFeaturesProvider>
        );

        // Should render without crashing - null features should show empty string
        expect(screen.getByText('Features: ')).toBeTruthy();
    });

    it('should provide correct context values when hook is used', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <EnabledFeaturesProvider
                enabledFeatures={mockEnabledFeatures}
                isLoading={false}
                error={null}
            >
                {children}
            </EnabledFeaturesProvider>
        );

        const { result } = renderHook(() => useEnabledFeaturesContext(), { wrapper });

        expect(result.current.enabledFeatures).toEqual(mockEnabledFeatures);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('should provide loading state in context', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <EnabledFeaturesProvider
                enabledFeatures={null}
                isLoading={true}
                error={null}
            >
                {children}
            </EnabledFeaturesProvider>
        );

        const { result } = renderHook(() => useEnabledFeaturesContext(), { wrapper });

        expect(result.current.isLoading).toBe(true);
        expect(result.current.enabledFeatures).toBeNull();
        expect(result.current.error).toBeNull();
    });

    it('should provide error state in context', () => {
        const errorMessage = 'Test error';
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <EnabledFeaturesProvider
                enabledFeatures={null}
                isLoading={false}
                error={errorMessage}
            >
                {children}
            </EnabledFeaturesProvider>
        );

        const { result } = renderHook(() => useEnabledFeaturesContext(), { wrapper });

        expect(result.current.error).toBe(errorMessage);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.enabledFeatures).toBeNull();
    });
});

