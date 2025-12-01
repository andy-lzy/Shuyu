import { supabase } from '../lib/supabase';

/**
 * Fetch all books for the current user
 */
export async function getBooks() {
    const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

/**
 * Fetch books by status (toread, reading, finished)
 */
export async function getBooksByStatus(status) {
    const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

/**
 * Get a single book by ID
 */
export async function getBookById(id) {
    const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

/**
 * Create a new book
 */
export async function createBook(bookData) {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from('books')
        .insert([{
            user_id: user.id,
            ...bookData
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Update an existing book
 */
export async function updateBook(id, updates) {
    const { data, error } = await supabase
        .from('books')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Delete a book
 */
export async function deleteBook(id) {
    const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

/**
 * Search books by title or author
 */
export async function searchBooks(query) {
    const { data, error } = await supabase
        .from('books')
        .select('*')
        .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}
