import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useDebounce } from '../hooks/useDebounce';

describe('useDebounce', () => {
    it('should return the initial value immediately', () => {
        const { result } = renderHook(() => useDebounce('initial', 500));
        expect(result.current).toBe('initial');
    });

    it('should debounce value updates', async () => {
        vi.useFakeTimers();
        const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
            initialProps: { value: 'initial', delay: 500 },
        });

        // Update value
        rerender({ value: 'updated', delay: 500 });

        // Should still be initial value immediately
        expect(result.current).toBe('initial');

        // Fast forward time by 200ms
        act(() => {
            vi.advanceTimersByTime(200);
        });
        expect(result.current).toBe('initial');

        // Fast forward past the delay
        act(() => {
            vi.advanceTimersByTime(300);
        });
        expect(result.current).toBe('updated');

        vi.useRealTimers();
    });
});
