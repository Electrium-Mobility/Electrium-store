import { forgotPasswordAction } from "@/app/action/auth";
import Link from "next/link";
import { FormMessage, Message } from "@/components/FormMessage";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <form action={forgotPasswordAction} className="border border-gray-200 bg-gray-100 p-8 rounded-lg w-full max-w-sm">
        <div>
          <h1 className="text-2xl font-medium">Reset Password</h1>
          <p className="text-sm text-secondary-foreground">
            <Link className="text-primary underline" href="/login">
              Back to sign in
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className="w-full p-2 mb-4 border border-green-300 rounded" />
          <button type="submit" className="w-full bg-green-600 text-white font-bold px-4 py-2 mt-4 rounded hover:bg-green-500">Reset Password</button>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </div>
  );
}