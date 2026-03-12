import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  req: NextRequest,
  { params }: { params: { cartId: string; itemId: string } }
) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { cartId, itemId } = params;
  const { quantity } = await req.json();

  if (!cartId || !itemId) {
    return NextResponse.json({ error: 'cartId and itemId are required' }, { status: 400 });
  }

  if (quantity === undefined) {
    return NextResponse.json({ error: 'quantity is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('group_cart_items')
    .update({ quantity })
    .eq('id', itemId)
    .eq('user_id', session.user.id); // for security, only allow user to update their own items

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { cartId: string; itemId: string } }
) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { cartId, itemId } = params;

  if (!cartId || !itemId) {
    return NextResponse.json({ error: 'cartId and itemId are required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('group_cart_items')
    .delete()
    .eq('id', itemId)
    .eq('user_id', session.user.id); // for security, only allow user to delete their own items

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
