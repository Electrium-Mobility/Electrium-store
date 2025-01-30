import { signup } from "../action/auth";

export default function SignupPage() {
    return (
        <form action={signup}>
            <p>Sign Up</p>
        </form>
    )
}