/**
 * Google Books API Service
 * Provides functions to search for books using the Google Books API
 */

const GOOGLE_BOOKS_API_BASE = 'https://www.googleapis.com/books/v1/volumes';

/**
 * Search for books using the Google Books API
 * @param {string} query - Search query (title, author, ISBN, etc.)
 * @param {number} maxResults - Maximum number of results to return (default: 10)
 * @returns {Promise<Array>} Array of formatted book objects
 */
export async function searchGoogleBooks(query, maxResults = 10) {
    if (!query || query.trim().length === 0) {
        return [];
    }

    try {
        const url = `${GOOGLE_BOOKS_API_BASE}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&orderBy=relevance`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Google Books API error: ${response.status}`);
        }

        const data = await response.json();

        // No results found
        if (!data.items || data.items.length === 0) {
            return [];
        }

        // Format and return results
        return data.items.map(item => formatBookData(item));

    } catch (error) {
        console.error('Error searching Google Books:', error);
        throw error;
    }
}

/**
 * Search by ISBN specifically
 * @param {string} isbn - ISBN-10 or ISBN-13
 * @returns {Promise<Object|null>} Formatted book object or null
 */
export async function searchByISBN(isbn) {
    if (!isbn) return null;

    try {
        const url = `${GOOGLE_BOOKS_API_BASE}?q=isbn:${encodeURIComponent(isbn)}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Google Books API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            return null;
        }

        return formatBookData(data.items[0]);

    } catch (error) {
        console.error('Error searching by ISBN:', error);
        throw error;
    }
}

/**
 * Get book details by Google Books ID
 * @param {string} googleBooksId - The Google Books volume ID
 * @returns {Promise<Object>} Formatted book object
 */
export async function getBookById(googleBooksId) {
    try {
        const url = `${GOOGLE_BOOKS_API_BASE}/${googleBooksId}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Google Books API error: ${response.status}`);
        }

        const data = await response.json();
        return formatBookData(data);

    } catch (error) {
        console.error('Error getting book details:', error);
        throw error;
    }
}

/**
 * Format Google Books API response to our app's format
 * @param {Object} item - Raw item from Google Books API
 * @returns {Object} Formatted book object
 */
function formatBookData(item) {
    const volumeInfo = item.volumeInfo || {};

    return {
        googleBooksId: item.id,
        title: volumeInfo.title || 'Unknown Title',
        subtitle: volumeInfo.subtitle || null,
        authors: volumeInfo.authors || [],
        author: volumeInfo.authors?.[0] || 'Unknown Author',
        publisher: volumeInfo.publisher || null,
        publishedDate: volumeInfo.publishedDate || null,
        description: volumeInfo.description || null,
        pageCount: volumeInfo.pageCount || null,
        categories: volumeInfo.categories || [],
        averageRating: volumeInfo.averageRating || null,
        ratingsCount: volumeInfo.ratingsCount || null,
        imageLinks: volumeInfo.imageLinks || {},
        coverUrl: getBestCoverImage(volumeInfo.imageLinks),
        language: volumeInfo.language || 'en',
        previewLink: volumeInfo.previewLink || null,
        infoLink: volumeInfo.infoLink || null,
        isbn: getISBN(volumeInfo.industryIdentifiers),
        isbn13: getISBN13(volumeInfo.industryIdentifiers),
        isbn10: getISBN10(volumeInfo.industryIdentifiers),
    };
}

/**
 * Get the best quality cover image available
 * @param {Object} imageLinks - Image links object from Google Books
 * @returns {string|null} Best available image URL
 */
function getBestCoverImage(imageLinks) {
    if (!imageLinks) return null;

    // Prefer higher quality images, convert http to https
    const convertToHttps = (url) => url?.replace('http://', 'https://');

    return convertToHttps(
        imageLinks.extraLarge ||
        imageLinks.large ||
        imageLinks.medium ||
        imageLinks.small ||
        imageLinks.thumbnail ||
        imageLinks.smallThumbnail ||
        null
    );
}

/**
 * Extract any ISBN from industry identifiers
 * @param {Array} identifiers - Industry identifiers array
 * @returns {string|null} ISBN or null
 */
function getISBN(identifiers) {
    if (!identifiers || identifiers.length === 0) return null;

    // Prefer ISBN_13 over ISBN_10
    const isbn13 = identifiers.find(id => id.type === 'ISBN_13');
    if (isbn13) return isbn13.identifier;

    const isbn10 = identifiers.find(id => id.type === 'ISBN_10');
    if (isbn10) return isbn10.identifier;

    // Return first identifier if no ISBN found
    return identifiers[0]?.identifier || null;
}

/**
 * Extract ISBN-13 specifically
 * @param {Array} identifiers - Industry identifiers array
 * @returns {string|null} ISBN-13 or null
 */
function getISBN13(identifiers) {
    if (!identifiers || identifiers.length === 0) return null;
    const isbn13 = identifiers.find(id => id.type === 'ISBN_13');
    return isbn13?.identifier || null;
}

/**
 * Extract ISBN-10 specifically
 * @param {Array} identifiers - Industry identifiers array
 * @returns {string|null} ISBN-10 or null
 */
function getISBN10(identifiers) {
    if (!identifiers || identifiers.length === 0) return null;
    const isbn10 = identifiers.find(id => id.type === 'ISBN_10');
    return isbn10?.identifier || null;
}
