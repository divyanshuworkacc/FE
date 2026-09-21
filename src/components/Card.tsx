import { useState } from "react";

interface CardProps {
    className?: string;
    title: string;
    description: string;
    src: string;
    onOpen?: () => void;
    onRename?: () => void;
    onDelete?: () => void;
}

export default function Card({
    className = "",
    title,
    description,
    src,
    onOpen,
    onRename,
    onDelete,
}: CardProps) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div
            onClick={onOpen}
            className={`
                group relative overflow-hidden
                rounded-lg bg-white shadow-md
                ${onOpen ? "cursor-pointer" : ""}
                ${className}
            `}
            title={description}
        >
            <img
                src={src}
                alt={title}
                className="h-[75px] w-full object-cover"
            />

            <div className="p-2">
                <h2 className="truncate pr-6">
                    {title}
                </h2>
            </div>

            {(onRename || onDelete) && (
                <div className="absolute right-2 top-2">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen((current) => !current);
                        }}
                        className="
                            flex h-7 w-7 items-center justify-center
                            rounded bg-black/30 text-white
                            opacity-0 transition
                            hover:bg-black/50
                            group-hover:opacity-100
                        "
                    >
                        •••
                    </button>

                    {menuOpen && (
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="
                                absolute right-0 top-8 z-20
                                w-28 overflow-hidden
                                rounded-md bg-white
                                py-1 shadow-lg
                            "
                        >
                            {onRename && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        onRename();
                                    }}
                                    className="
                                        w-full px-3 py-2
                                        text-left text-sm
                                        hover:bg-gray-100
                                    "
                                >
                                    Rename
                                </button>
                            )}

                            {onDelete && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        onDelete();
                                    }}
                                    className="
                                        w-full px-3 py-2
                                        text-left text-sm text-red-600
                                        hover:bg-red-50
                                    "
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}