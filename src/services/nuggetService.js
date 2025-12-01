import { supabase } from '../lib/supabase';

/**
 * Fetch all nuggets for the current user
 */
export async function getNuggets() {
    const { data, error } = await supabase
        .from('nuggets')
        .select(`
      *,
      books (
        id,
        title,
        author,
        cover_url
      )
    `)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

/**
 * Fetch nuggets for a specific book
 */
export async function getNuggetsByBook(bookId) {
    const { data, error } = await supabase
        .from('nuggets')
        .select('*')
        .eq('book_id', bookId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

/**
 * Fetch favorite nuggets
 */
export async function getFavoriteNuggets() {
    const { data, error } = await supabase
        .from('nuggets')
        .select(`
      *,
      books (
        id,
        title,
        author,
        cover_url
      )
    `)
        .eq('is_favorite', true)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

/**
 * Create a new nugget
 */
export async function createNugget(nuggetData) {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from('nuggets')
        .insert([{
            user_id: user.id,
            ...nuggetData
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Update a nugget
 */
export async function updateNugget(id, updates) {
    const { data, error } = await supabase
        .from('nuggets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Toggle favorite status of a nugget
 */
export async function toggleFavorite(id, currentStatus) {
    return updateNugget(id, { is_favorite: !currentStatus });
}

/**
 * Delete a nugget
 */
export async function deleteNugget(id) {
    const { error } = await supabase
        .from('nuggets')
        .delete()
        .eq('id', id);

    if (error) throw error;
}
