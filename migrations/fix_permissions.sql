-- Grant execute permission on the function to public (anon) and authenticated users
GRANT EXECUTE ON FUNCTION get_shared_nugget_data(bigint) TO anon, authenticated, service_role;
