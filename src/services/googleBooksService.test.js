import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { searchGoogleBooks, searchByISBN, getBookById } from './googleBooksService';

// Mock global fetch
global.fetch = vi.fn();

describe('googleBooksService', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('searchGoogleBooks', () => {
        it('should return empty array for empty query', async () => {
            const results = await searchGoogleBooks('');
            expect(results).toEqual([]);
            expect(fetch).not.toHaveBeenCalled();
        });

        it('should fetch and format results correctly', async () => {
            const mockResponse = {
                items: [
                    {
                        id: '123',
                        volumeInfo: {
                            title: 'Test Book',
                            authors: ['Test Author'],
                            imageLinks: { thumbnail: 'http://example.com/img.jpg' },
                            publishedDate: '2023',
                            pageCount: 100,
                            industryIdentifiers: [{ type: 'ISBN_13', identifier: '9781234567890' }]
                        }
                    }
                ]
            };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse
            });

            const results = await searchGoogleBooks('test query');

            expect(fetch).toHaveBeenCalledWith(expect.stringContaining('q=test%20query'));
            expect(results).toHaveLength(1);
            expect(results[0]).toEqual({
                googleBooksId: '123',
                title: 'Test Book',
                subtitle: null,
                authors: ['Test Author'],
                author: 'Test Author',
                publisher: null,
                publishedDate: '2023',
                description: null,
                pageCount: 100,
                categories: [],
                averageRating: null,
                ratingsCount: null,
                imageLinks: { thumbnail: 'http://example.com/img.jpg' },
                coverUrl: 'https://example.com/img.jpg', // Should convert http to https
                language: 'en',
                previewLink: null,
                infoLink: null,
                isbn: '9781234567890',
                isbn13: '9781234567890',
                isbn10: null
            });
        });

        it('should handle API errors gracefully', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 500
            });

            await expect(searchGoogleBooks('error')).rejects.toThrow('Google Books API error: 500');
        });
    });

    describe('searchByISBN', () => {
        it('should return null if no ISBN provided', async () => {
            const result = await searchByISBN('');
            expect(result).toBeNull();
        });

        it('should return formatted book when found', async () => {
            const mockResponse = {
                items: [{ id: 'abc', volumeInfo: { title: 'ISBN Book' } }]
            };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse
            });

            const result = await searchByISBN('978123');
            expect(result.title).toBe('ISBN Book');
            expect(fetch).toHaveBeenCalledWith(expect.stringContaining('q=isbn:978123'));
        });
    });
});
