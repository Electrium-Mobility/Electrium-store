import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { itemId } = params;
  const { quantity } = await req.json();

  if (!itemId) {
    return NextResponse.json({ error: 'itemId is required' }, { status: 400 });
  }

  if (quantity === undefined) {
    return NextResponse.json({ error: 'quantity is required' }, { status: 400 });
  }

  // To ensure user can only update their own cart items, we can join with personal_carts table
  const { data: cart, error: cartError } = await supabase
    .from('personal_carts')
    .select('id')
    .eq('user_id', session.user.id)
    .single();

  if(cartError || !cart) {
    return NextResponse.json({ error: 'Personal cart not found' }, { status: 404 });
  }

  const { data, error } = await supabase
    .from('personal_cart_items')
    .update({ quantity })
    .eq('id', itemId)
    .eq('cart_id', cart.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { itemId } = params;

  if (!itemId) {
    return NextResponse.json({ error: 'itemId is required' }, { status: 400 });
  }

  const { data: cart, error: cartError } = await supabase
  .from('personal_carts')
  .select('id')
  .eq('user_id', session.user.id)
  .single();

  if(cartError || !cart) {
    return NextResponse.json({ error: 'Personal cart not found' }, { status: 404 });
  }

  const { data, error } = await supabase
    .from('personal_cart_items')
    .delete()
    .eq('id', itemId)
    .eq('cart_id', cart.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
