import Link from "next/link";
import { login, signup } from "../action/auth";

export default function LoginPage() {
  return (
    <form className="h-screen w-full flex flex-col items-center justify-center" action={login}>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button type="submit">Log in</button>
      <Link href="/signup">Sign up</Link>
    </form>
  )
}