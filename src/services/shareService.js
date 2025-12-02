import { supabase } from '../lib/supabase';
import { nanoid } from 'nanoid';

/**
 * Create a shareable link for a nugget
 */
export async function createShareLink(nuggetId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in to share');

    // Generate unique short ID
    const shareId = nanoid(10);

    const { data, error } = await supabase
        .from('shared_nuggets')
        .insert([{
            nugget_id: nuggetId,
            share_id: shareId,
            created_by: user.id
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Get shared nugget by share ID (public - no auth required)
 */
export async function getSharedNugget(shareId) {
    // First get the shared record
    const { data: shared, error: sharedError } = await supabase
        .from('shared_nuggets')
        .select('nugget_id, view_count')
        .eq('share_id', shareId)
        .single();

    if (sharedError) throw sharedError;
    if (!shared) throw new Error('Share link not found');

    // Increment view count
    await supabase
        .from('shared_nuggets')
        .update({ view_count: shared.view_count + 1 })
        .eq('share_id', shareId);

    // Get the nugget with book details (bypass RLS by using service role or making nugget public)
    // For now, we'll use a function approach
    const { data: nuggetData, error: nuggetError } = await supabase
        .rpc('get_shared_nugget_data', { nugget_id: shared.nugget_id });

    if (nuggetError) throw nuggetError;
    return nuggetData;
}

/**
 * Save shared nugget to current user's library
 */
export async function saveSharedNugget(shareId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in to save');

    // Get shared nugget data
    const sharedData = await getSharedNugget(shareId);

    const book = sharedData.book;
    const nugget = sharedData.nugget;

    // 1. Check if user already has this book (by ISBN or title+author)
    let userBook;

    if (book.isbn) {
        const { data: existingByISBN } = await supabase
            .from('books')
            .select('*')
            .eq('user_id', user.id)
            .eq('isbn', book.isbn)
            .single();

        userBook = existingByISBN;
    }

    // Fallback: match by title and author
    if (!userBook) {
        const { data: existingByTitle } = await supabase
            .from('books')
            .select('*')
            .eq('user_id', user.id)
            .eq('title', book.title)
            .eq('author', book.author)
            .single();

        userBook = existingByTitle;
    }

    // 2. Create book if user doesn't have it
    if (!userBook) {
        const { data: newBook, error: bookError } = await supabase
            .from('books')
            .insert([{
                user_id: user.id,
                title: book.title,
                author: book.author,
                cover_url: book.cover_url,
                publisher: book.publisher,
                published_date: book.published_date,
                isbn: book.isbn,
                total_pages: book.total_pages
            }])
            .select()
            .single();

        if (bookError) throw bookError;
        userBook = newBook;
    }

    // 3. Check if user already has this exact nugget
    const { data: existingNugget } = await supabase
        .from('nuggets')
        .select('id')
        .eq('user_id', user.id)
        .eq('book_id', userBook.id)
        .eq('content', nugget.content)
        .single();

    if (existingNugget) {
        throw new Error('You already have this nugget in your library');
    }

    // 4. Save nugget to user's library
    const { data: savedNugget, error: nuggetError } = await supabase
        .from('nuggets')
        .insert([{
            user_id: user.id,
            book_id: userBook.id,
            content: nugget.content,
            page_number: nugget.page_number,
            tags: nugget.tags,
            note: nugget.note
        }])
        .select()
        .single();

    if (nuggetError) throw nuggetError;

    return {
        book: userBook,
        nugget: savedNugget
    };
}

/**
 * Delete a share link
 */
export async function deleteShareLink(shareId) {
    const { error } = await supabase
        .from('shared_nuggets')
        .delete()
        .eq('share_id', shareId);

    if (error) throw error;
}

/**
 * Get all share links created by current user
 */
export async function getUserShares() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const { data, error } = await supabase
        .from('shared_nuggets')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}
