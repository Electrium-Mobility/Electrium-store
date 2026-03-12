import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { shareable_link } = await req.json();

  if (!shareable_link) {
    return NextResponse.json({ error: 'shareable_link is required' }, { status: 400 });
  }

  const { error } = await supabase
    .rpc('join_group_cart', { shareable_link_param: shareable_link });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Successfully joined group cart' });
}
