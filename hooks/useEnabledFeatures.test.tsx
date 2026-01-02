import { renderHook, waitFor } from '@testing-library/react-native';
import { useEnabledFeatures } from './useEnabledFeatures';
import * as httpService from '../Services/http';
import { EnabledFeatures } from '../Services/http';

// Mock the http service
jest.mock('../Services/http');

describe('useEnabledFeatures', () => {
    const mockGetEnabledFeatures = httpService.getEnabledFeatures as jest.MockedFunction<typeof httpService.getEnabledFeatures>;
    const originalConsoleError = console.error;

    beforeEach(() => {
        jest.clearAllMocks();
        // Suppress console.error during tests
        console.error = jest.fn();
    });

    afterEach(() => {
        console.error = originalConsoleError;
    });

    it('should fetch enabled features on mount', async () => {
        const mockFeatures: EnabledFeatures = {
            partnerId: 'partner123',
            enabledFeatureNames: ['AVC', 'Wills', 'Mortgages', 'Protection', 'Payroll Savings'],
        };

        mockGetEnabledFeatures.mockResolvedValue(mockFeatures);

        const { result } = renderHook(() => useEnabledFeatures('partner123'));

        expect(result.current.isLoading).toBe(true);
        expect(result.current.enabledFeatures).toBeNull();
        expect(result.current.error).toBeNull();

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.enabledFeatures).toEqual(mockFeatures);
        expect(result.current.error).toBeNull();
        expect(mockGetEnabledFeatures).toHaveBeenCalledWith('partner123');
    });

    it('should handle errors correctly', async () => {
        const errorMessage = 'Network error';
        const error = new Error(errorMessage);
        mockGetEnabledFeatures.mockRejectedValue(error);

        const { result } = renderHook(() => useEnabledFeatures('partner123'));

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.enabledFeatures).toBeNull();
        expect(result.current.error).toBe(errorMessage);
        expect(console.error).toHaveBeenCalledWith('Error fetching enabled features:', error);
    });

    it('should not fetch if partnerId is empty', async () => {
        const { result } = renderHook(() => useEnabledFeatures(''));

        // Wait a bit to ensure useEffect has run
        await waitFor(() => {
            expect(result.current.isLoading).toBe(true);
        }, { timeout: 100 });

        expect(mockGetEnabledFeatures).not.toHaveBeenCalled();
    });

    it('should provide refetch function', async () => {
        const mockFeatures: EnabledFeatures = {
            partnerId: 'partner123',
            enabledFeatureNames: ['AVC', 'Wills'],
        };

        mockGetEnabledFeatures.mockResolvedValue(mockFeatures);

        const { result } = renderHook(() => useEnabledFeatures('partner123'));

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        // Refetch
        const updatedFeatures: EnabledFeatures = {
            partnerId: 'partner123',
            enabledFeatureNames: ['AVC', 'Wills', 'Mortgages', 'Protection', 'Payroll Savings'],
        };
        mockGetEnabledFeatures.mockResolvedValue(updatedFeatures);

        await result.current.refetch();

        await waitFor(() => {
            expect(result.current.enabledFeatures).toEqual(updatedFeatures);
        });

        expect(mockGetEnabledFeatures).toHaveBeenCalledTimes(2);
    });

    it('should handle non-Error exceptions', async () => {
        mockGetEnabledFeatures.mockRejectedValue('String error');

        const { result } = renderHook(() => useEnabledFeatures('partner123'));

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.error).toBe('Failed to fetch enabled features');
    });
});

