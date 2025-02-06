import { resetPasswordAction } from "@/app/action/auth";
import { FormMessage, Message } from "@/components/FormMessage";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <form action={resetPasswordAction} className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4">
        <h1 className="text-2xl font-medium">Reset password</h1>
        <p className="text-sm text-foreground/60">
          Please enter your new password below.
        </p>
        <label htmlFor="password">New password</label>
        <input
          id="password"
          name="password"
          required
          type="password"
          className="w-full p-2 pr-9 mb-4 border border-green-300 rounded"
        />
        <label htmlFor="confirmPassword">Confirm password</label>
        <input
          id="password"
          name="confirmPassword"
          required
          type="password"
          className="w-full p-2 pr-9 mb-4 border border-green-300 rounded"
        />
        <button type="submit" className="w-full bg-green-600 text-white font-bold px-4 py-2 mt-4 rounded hover:bg-green-500">Reset Password</button>
        <FormMessage message={searchParams} />
      </form>
    </div>
  );
}