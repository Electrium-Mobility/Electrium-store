import { forgotPasswordAction } from "@/app/action/auth";
import Link from "next/link";
import { FormMessage, Message } from "@/components/FormMessage";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="h-screen w-full flex items-center justify-center bg-background text-text-primary">
      <form
        action={forgotPasswordAction}
        className="border border-border bg-surface p-8 rounded-lg w-full max-w-sm"
      >
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
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full p-2 mb-4 border border-[hsl(var(--border))] rounded bg-[hsl(var(--surface))] text-[hsl(var(--text-primary))] focus:ring-2 focus:ring-[hsl(var(--border-focus))] focus:border-[hsl(var(--border-focus))]"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-text-inverse font-bold px-4 py-2 mt-4 rounded hover:bg-status-success"
          >
            Reset Password
          </button>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </div>
  );
}
