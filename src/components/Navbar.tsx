import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex items-center justify-between">
                <Link to="/boards" className="text-white font-bold text-xl">Trello</Link>
                <div className="space-x-4">
                    <Link to="/boards" className="text-gray-300 hover:text-white">Home</Link>
                    <a href="#" className="text-gray-300 hover:text-white">About</a>
                    <a href="#" className="text-gray-300 hover:text-white">Contact</a>
                </div>
            </div>
        </nav>
    );
}