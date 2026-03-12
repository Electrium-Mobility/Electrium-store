import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import CreateGroupCartForm from './CreateGroupCartForm';
import JoinGroupCartForm from './JoinGroupCartForm';

export default async function GroupCartsPage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: groupCarts, error } = await supabase.rpc('get_user_group_carts');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Group Carts</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Create a New Group Cart</h2>
          <CreateGroupCartForm />
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Join a Group Cart</h2>
          <JoinGroupCartForm />
        </div>
      </div>

      {error && <p className="text-red-500">{error.message}</p>}

      {groupCarts && groupCarts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groupCarts.map((cart: any) => (
            <Link href={`/group-carts/${cart.id}`} key={cart.id}>
              <div className="p-4 border rounded-lg hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold">{cart.name}</h3>
                <p className="text-sm text-gray-500">Owner ID: {cart.owner_id}</p>
                <p className="text-sm text-gray-500">Shareable Link: {cart.shareable_link}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>You are not a member of any group carts.</p>
      )}
    </div>
  );
}
