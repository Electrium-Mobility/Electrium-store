import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { cartId: string; userId: string } }
) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { cartId, userId } = params;

  if (!cartId || !userId) {
    return NextResponse.json({ error: 'cartId and userId are required' }, { status: 400 });
  }

  // Check if the current user is the owner of the cart
  const { data: cartData, error: cartError } = await supabase
    .from('group_carts')
    .select('owner_id')
    .eq('id', cartId)
    .single();

  if (cartError || !cartData) {
    return NextResponse.json({ error: 'Group cart not found' }, { status: 404 });
  }

  const isOwner = cartData.owner_id === session.user.id;
  const isLeaving = session.user.id === userId;

  // Only the owner can remove other users, or a user can remove themselves (leave)
  if (!isOwner && !isLeaving) {
    return NextResponse.json({ error: 'You do not have permission to remove this user' }, { status: 403 });
  }
  
  // A user cannot be removed by another user if they are the group owner
  if(cartData.owner_id === userId && !isLeaving) {
    return NextResponse.json({ error: 'The group owner cannot be removed' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('group_cart_members')
    .delete()
    .eq('group_cart_id', cartId)
    .eq('user_id', userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
