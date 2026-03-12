import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import CartItems from './CartItems';
import CartMembers from './CartMembers';

export default async function GroupCartDetailPage({
  params,
}: {
  params: { cartId: string };
}) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: cart, error } = await supabase
    .rpc('get_group_cart', { p_group_cart_id: params.cartId });

  if (error) {
    return <p className="text-red-500 p-4">{error.message}</p>;
  }

  if (!cart) {
    return <p className="p-4">Group cart not found.</p>;
  }

  const { details, members, items } = cart;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{details.name}</h1>
      <p className="text-sm text-gray-500 mb-4">
        Shareable Link: {details.shareable_link}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Cart Items</h2>
          <CartItems items={items || []} cartId={params.cartId} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Members</h2>
          <CartMembers members={members || []} cartId={params.cartId} ownerId={details.owner_id} />
        </div>
      </div>
      
      <div className="mt-8">
        <button className="bg-green-500 text-white p-2 rounded w-full md:w-auto">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
