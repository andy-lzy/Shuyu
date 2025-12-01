import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getBooks, createBook, updateBook } from './bookService';
import { supabase } from '../lib/supabase';

// Mock the supabase client
vi.mock('../lib/supabase', () => ({
    supabase: {
        from: vi.fn(),
        auth: {
            getUser: vi.fn()
        }
    }
}));

describe('bookService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getBooks', () => {
        it('should fetch books successfully', async () => {
            const mockData = [{ id: 1, title: 'Book 1' }];

            // Mock chain: from -> select -> order
            const orderMock = vi.fn().mockResolvedValue({ data: mockData, error: null });
            const selectMock = vi.fn().mockReturnValue({ order: orderMock });
            supabase.from.mockReturnValue({ select: selectMock });

            const result = await getBooks();

            expect(supabase.from).toHaveBeenCalledWith('books');
            expect(selectMock).toHaveBeenCalledWith('*');
            expect(result).toEqual(mockData);
        });

        it('should throw error on failure', async () => {
            const orderMock = vi.fn().mockResolvedValue({ data: null, error: { message: 'DB Error' } });
            const selectMock = vi.fn().mockReturnValue({ order: orderMock });
            supabase.from.mockReturnValue({ select: selectMock });

            await expect(getBooks()).rejects.toEqual({ message: 'DB Error' });
        });
    });

    describe('createBook', () => {
        it('should create a book with user_id', async () => {
            const mockUser = { id: 'user-123' };
            const mockBook = { title: 'New Book' };
            const mockCreatedBook = { id: 1, ...mockBook, user_id: 'user-123' };

            // Mock auth
            supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

            // Mock chain: from -> insert -> select -> single
            const singleMock = vi.fn().mockResolvedValue({ data: mockCreatedBook, error: null });
            const selectMock = vi.fn().mockReturnValue({ single: singleMock });
            const insertMock = vi.fn().mockReturnValue({ select: selectMock });
            supabase.from.mockReturnValue({ insert: insertMock });

            const result = await createBook(mockBook);

            expect(supabase.auth.getUser).toHaveBeenCalled();
            expect(insertMock).toHaveBeenCalledWith([{ ...mockBook, user_id: mockUser.id }]);
            expect(result).toEqual(mockCreatedBook);
        });
    });
});
