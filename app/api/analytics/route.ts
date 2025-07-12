// ... existing code ...
// Fetch user profile from customers table
const { data: profile } = await supabase
  .from("customers")
  .select("*")
  .eq("id", user.id)
  .single();
// ... existing code ...
