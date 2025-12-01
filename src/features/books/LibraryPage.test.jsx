import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LibraryPage from './LibraryPage';
import * as bookService from '../../services/bookService';

// Mock service
vi.mock('../../services/bookService');

describe('LibraryPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading state initially', () => {
        // Return a promise that never resolves immediately to test loading state
        bookService.getBooks.mockReturnValue(new Promise(() => { }));

        render(
            <MemoryRouter>
                <LibraryPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders books after fetching', async () => {
        const mockBooks = [
            {
                id: 1,
                title: 'Library Book 1',
                author: 'Author 1',
                status: 'reading',
                progress: 50,
                total_pages: 100,
                current_page: 50
            },
            {
                id: 2,
                title: 'Library Book 2',
                author: 'Author 2',
                status: 'finished',
                progress: 100,
                total_pages: 200,
                current_page: 200
            }
        ];

        bookService.getBooks.mockResolvedValue(mockBooks);

        render(
            <MemoryRouter>
                <LibraryPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Library Book 1')).toBeInTheDocument();
            expect(screen.getByText('Library Book 2')).toBeInTheDocument();
        });

        expect(screen.getByText('2 books collected')).toBeInTheDocument();
    });

    it('shows empty state when no books found', async () => {
        bookService.getBooks.mockResolvedValue([]);

        render(
            <MemoryRouter>
                <LibraryPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('No books yet')).toBeInTheDocument();
            expect(screen.getByText('Start adding books to your library!')).toBeInTheDocument();
        });
    });

    it('handles fetch errors', async () => {
        bookService.getBooks.mockRejectedValue(new Error('Failed to fetch'));

        render(
            <MemoryRouter>
                <LibraryPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Error loading books: Failed to fetch')).toBeInTheDocument();
        });
    });
});
