import { createClient } from '../../../../../Downloads/electrium-shop-supabase-main 2/utils/supabase/server';

export default async function Notes() {
    const supabase = createClient();
    const { data: notes } = await supabase.from("bikes").select();

    return <pre>{JSON.stringify(notes, null, 2)}</pre>
}