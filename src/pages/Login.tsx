import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
    async function handleGoogleLogin() {
        try {
            const provider = new GoogleAuthProvider();

            const result = await signInWithPopup(auth, provider);

            console.log(result.user);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <button onClick={handleGoogleLogin}>
                Continue with Google
            </button>
        </div>
    );
}