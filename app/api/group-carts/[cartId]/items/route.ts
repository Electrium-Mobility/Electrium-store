import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: { cartId: string } }
) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { cartId } = params;
  const { product_id, quantity } = await req.json();

  if (!cartId) {
    return NextResponse.json({ error: 'cartId is required' }, { status: 400 });
  }

  if (!product_id || !quantity) {
    return NextResponse.json({ error: 'product_id and quantity are required' }, { status: 400 });
  }

  // First, check if the user is a member of the group cart
  const { data: memberData, error: memberError } = await supabase
    .from('group_cart_members')
    .select('id')
    .eq('group_cart_id', cartId)
    .eq('user_id', session.user.id)
    .single();

  if (memberError || !memberData) {
    return NextResponse.json({ error: 'You are not a member of this group cart' }, { status: 403 });
  }

  // Check if the item already exists in the cart for the user
  const { data: existingItem, error: existingError } = await supabase
    .from('group_cart_items')
    .select('id, quantity')
    .eq('group_cart_id', cartId)
    .eq('product_id', product_id)
    .eq('user_id', session.user.id)
    .single();

  if (existingItem) {
    // If it exists, update the quantity
    const { data, error } = await supabase
      .from('group_cart_items')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } else {
    // If it doesn't exist, insert a new item
    const { data, error } = await supabase
      .from('group_cart_items')
      .insert([
        {
          group_cart_id: cartId,
          product_id,
          quantity,
          user_id: session.user.id,
        },
      ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  }
}
