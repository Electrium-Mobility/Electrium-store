import Link from "next/link";
import { signup } from "../action/auth";

export default function SignupPage() {
  return (
    <form action={signup} className="h-screen w-full flex flex-col items-center justify-center">
      <label htmlFor="first_name">First Name:</label>
      <input id="first_name" name="first_name" type="text" required />
      <label htmlFor="last_name">Last Name:</label>
      <input id="last_name" name="last_name" type="text" required />
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button type="submit">Sign up</button>
      <Link href="/login">Go back to login</Link>
    </form>
  );
}
