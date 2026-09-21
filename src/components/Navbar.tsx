import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar() {
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await signOut(auth);
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Failed to log out", error);
        }
    }

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex items-center justify-between">
                <Link to="/boards" className="text-white font-bold text-xl">Trello</Link>
                <div className="flex items-center gap-4">
                    <Link to="/boards" className="text-gray-300 hover:text-white">Home</Link>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
                    >
                        Log out
                    </button>
                </div>
            </div>
        </nav>
    );
}