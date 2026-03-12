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

  const { product_id, quantity } = await req.json();

  if (!product_id || !quantity) {
    return NextResponse.json({ error: 'product_id and quantity are required' }, { status: 400 });
  }

  // Get or create the user's personal cart
  let { data: cart, error: cartError } = await supabase
    .from('personal_carts')
    .select('id')
    .eq('user_id', session.user.id)
    .single();

  if (cartError && cartError.code !== 'PGRST116') { // PGRST116: no rows found
    return NextResponse.json({ error: cartError.message }, { status: 500 });
  }

  if (!cart) {
    const { data: newCart, error: newCartError } = await supabase
      .from('personal_carts')
      .insert({ user_id: session.user.id })
      .select('id')
      .single();

    if (newCartError) {
      return NextResponse.json({ error: newCartError.message }, { status: 500 });
    }
    cart = newCart;
  }
  
  if (!cart) {
    return NextResponse.json({ error: "Could not create or find user cart" }, { status: 500 });
  }

  // Check if the item already exists in the cart
  const { data: existingItem, error: existingError } = await supabase
    .from('personal_cart_items')
    .select('id, quantity')
    .eq('cart_id', cart.id)
    .eq('product_id', product_id)
    .single();

  if (existingItem) {
    // If it exists, update the quantity
    const { data, error } = await supabase
      .from('personal_cart_items')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } else {
    // If it doesn't exist, insert a new item
    const { data, error } = await supabase
      .from('personal_cart_items')
      .insert([
        {
          cart_id: cart.id,
          product_id,
          quantity,
        },
      ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  }
}
