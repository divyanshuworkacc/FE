import { Link, useNavigate } from "react-router-dom";
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
        <nav className="h-12 border-b border-white/10 bg-[#1d2125]/95 px-3 text-white backdrop-blur">
            <div className="flex h-full items-center justify-between">
                
                <div className="flex items-center gap-2">
                    <button
                        className="flex h-8 w-8 items-center justify-center rounded hover:bg-white/10"
                        title="Menu"
                    >
                        <span className="text-xl">⋮⋮</span>
                    </button>

                    <Link
                        to="/boards"
                        className="flex items-center gap-2 rounded px-2 py-1 font-bold hover:bg-white/10"
                    >
                        <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-[#579dff] text-xs font-bold text-[#1d2125]">
                            T
                        </div>

                        <span className="text-lg">
                            Trello
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <div className="hidden md:block">
                        <input
                            type="text"
                            placeholder="Search"
                            className="h-8 w-52 rounded border border-white/20 bg-white/10 px-3 text-sm text-white outline-none placeholder:text-gray-300 focus:border-[#579dff] focus:bg-white/15"
                        />
                    </div>

                    <button
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#579dff] text-sm font-semibold text-[#1d2125] hover:bg-[#85b8ff]"
                        title="Account"
                    >
                        {auth.currentUser?.email?.charAt(0).toUpperCase() || "A"}
                    </button>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded px-3 py-1.5 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
                    >
                        Log out
                    </button>
                </div>
            </div>
        </nav>
    );
}