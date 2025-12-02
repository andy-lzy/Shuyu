-- Database function to get shared nugget data (bypasses RLS)
-- Run this in Supabase SQL Editor

CREATE OR REPLACE FUNCTION get_shared_nugget_data(nugget_id bigint)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'nugget', json_build_object(
      'id', n.id,
      'content', n.content,
      'page_number', n.page_number,
      'tags', n.tags,
      'note', n.note,
      'created_at', n.created_at
    ),
    'book', json_build_object(
      'id', b.id,
      'title', b.title,
      'author', b.author,
      'cover_url', b.cover_url,
      'publisher', b.publisher,
      'published_date', b.published_date,
      'isbn', b.isbn,
      'total_pages', b.total_pages
    )
  ) INTO result
  FROM nuggets n
  JOIN books b ON n.book_id = b.id
  WHERE n.id = nugget_id;
  
  RETURN result;
END;
$$;
