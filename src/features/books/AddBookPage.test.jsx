import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AddBookPage from './AddBookPage';
import * as bookService from '../../services/bookService';
import * as googleBooksService from '../../services/googleBooksService';

// Mock services
vi.mock('../../services/bookService');
vi.mock('../../services/googleBooksService');

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

describe('AddBookPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly with default manual tab', () => {
        render(
            <MemoryRouter>
                <AddBookPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Add Book')).toBeInTheDocument();
        expect(screen.getByText('Manual')).toHaveClass('bg-white'); // Active tab
        expect(screen.getByPlaceholderText('e.g. The Psychology of Money')).toBeInTheDocument();
    });

    it('switches to search tab', () => {
        render(
            <MemoryRouter>
                <AddBookPage />
            </MemoryRouter>
        );

        const searchTab = screen.getByText('Search');
        fireEvent.click(searchTab);

        expect(screen.getByPlaceholderText('Search by title, author, or ISBN...')).toBeInTheDocument();
    });

    it('performs search and displays results', async () => {
        const mockResults = [
            {
                googleBooksId: '1',
                title: 'Test Search Book',
                author: 'Search Author',
                coverUrl: 'http://example.com/cover.jpg'
            }
        ];

        googleBooksService.searchGoogleBooks.mockResolvedValue(mockResults);

        render(
            <MemoryRouter>
                <AddBookPage />
            </MemoryRouter>
        );

        // Switch to search
        fireEvent.click(screen.getByText('Search'));

        // Type query
        const searchInput = screen.getByPlaceholderText('Search by title, author, or ISBN...');
        fireEvent.change(searchInput, { target: { value: 'test' } });

        // Wait for debounce and search
        await waitFor(() => {
            expect(googleBooksService.searchGoogleBooks).toHaveBeenCalledWith('test', 10);
        });

        expect(screen.getByText('Test Search Book')).toBeInTheDocument();
    });

    it('submits manual form successfully', async () => {
        bookService.createBook.mockResolvedValue({ id: 1, title: 'New Book' });

        render(
            <MemoryRouter>
                <AddBookPage />
            </MemoryRouter>
        );

        // Fill form
        fireEvent.change(screen.getByPlaceholderText('e.g. The Psychology of Money'), {
            target: { value: 'My New Book' }
        });

        // Submit
        const submitBtn = screen.getByText('Add to Library');
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(bookService.createBook).toHaveBeenCalledWith(expect.objectContaining({
                title: 'My New Book',
                status: 'toread'
            }));
        });

        // Check success message and navigation
        expect(await screen.findByText('Book added successfully! Redirecting...')).toBeInTheDocument();

        // Wait for navigation timeout
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/library');
        }, { timeout: 2000 });
    });
});
