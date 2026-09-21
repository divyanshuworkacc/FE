import { useState } from "react";
import { Navigate } from "react-router-dom";
import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";

import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { user, loading } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignup, setIsSignup] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <p className="text-slate-500">Loading...</p>
            </div>
        );
    }

    if (user) {
        return <Navigate to="/boards" replace />;
    }

    async function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setError("");
        setMessage("");
        setSubmitting(true);

        try {
            if (isSignup) {
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
            } else {
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
            }
        } catch (error) {
            setError(getErrorMessage(error));
        } finally {
            setSubmitting(false);
        }
    }

    async function handleGoogleLogin() {
        setError("");
        setMessage("");
        setSubmitting(true);

        try {
            const provider = new GoogleAuthProvider();

            await signInWithPopup(auth, provider);
        } catch (error) {
            setError(getErrorMessage(error));
        } finally {
            setSubmitting(false);
        }
    }

    async function handleForgotPassword() {
        setError("");
        setMessage("");

        if (!email.trim()) {
            setError("Enter your email first.");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);

            setMessage(
                "Password reset email sent. Check your inbox."
            );
        } catch (error) {
            setError(getErrorMessage(error));
        }
    }

    function changeMode() {
        setIsSignup((current) => !current);
        setError("");
        setMessage("");
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <div className="w-full max-w-[400px]">

                <div className="mb-6 text-center">
                    <h1 className="text-4xl font-bold text-[#0c66e4]">
                        Trello
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Organize your work and get things done.
                    </p>
                </div>

                <div className="rounded-xl bg-white p-8 shadow-lg">
                    <h2 className="mb-6 text-center text-xl font-semibold text-slate-800">
                        {isSignup
                            ? "Create your account"
                            : "Log in to continue"}
                    </h2>

                    <form
                        onSubmit={handleEmailSubmit}
                        className="space-y-4"
                    >
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1 block text-sm font-medium text-slate-700"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                                placeholder="you@example.com"
                                className="
                                    w-full rounded-md border
                                    border-slate-300 px-3 py-2.5
                                    outline-none transition
                                    focus:border-[#0c66e4]
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1 block text-sm font-medium text-slate-700"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                                minLength={6}
                                placeholder="Enter your password"
                                className="
                                    w-full rounded-md border
                                    border-slate-300 px-3 py-2.5
                                    outline-none transition
                                    focus:border-[#0c66e4]
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                            />
                        </div>

                        {!isSignup && (
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-sm text-[#0c66e4] hover:underline"
                            >
                                Forgot password?
                            </button>
                        )}

                        {error && (
                            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="
                                w-full rounded-md
                                bg-[#0c66e4] py-2.5
                                font-medium text-white
                                transition
                                hover:bg-[#0055cc]
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >
                            {submitting
                                ? "Please wait..."
                                : isSignup
                                  ? "Create account"
                                  : "Log in"}
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-slate-200" />

                        <span className="text-xs text-slate-400">
                            OR
                        </span>

                        <div className="h-px flex-1 bg-slate-200" />
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={submitting}
                        className="
                            flex w-full items-center
                            justify-center gap-3
                            rounded-md border
                            border-slate-300
                            bg-white py-2.5
                            font-medium text-slate-700
                            transition
                            hover:bg-slate-50
                            disabled:opacity-60
                        "
                    >
                        <span className="text-lg font-bold text-[#4285F4]">
                            G
                        </span>

                        Continue with Google
                    </button>

                    <div className="mt-6 border-t border-slate-200 pt-5 text-center text-sm text-slate-600">
                        {isSignup
                            ? "Already have an account?"
                            : "Don't have an account?"}

                        <button
                            type="button"
                            onClick={changeMode}
                            className="ml-1 font-medium text-[#0c66e4] hover:underline"
                        >
                            {isSignup ? "Log in" : "Sign up"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function getErrorMessage(error: unknown) {
    const code = (error as { code?: string }).code;

    switch (code) {
        case "auth/email-already-in-use":
            return "An account with this email already exists.";

        case "auth/invalid-email":
            return "Enter a valid email address.";

        case "auth/weak-password":
            return "Password is too weak.";

        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
            return "Incorrect email or password.";

        case "auth/popup-closed-by-user":
            return "Google sign-in was cancelled.";

        default:
            return "Something went wrong. Please try again.";
    }
}