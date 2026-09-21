import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface ListProps {
    id: number;
    title: string;
    children?: ReactNode;
    onRename?: (title: string) => void;
    onDelete?: () => void;
}

export default function List({
    id,
    title,
    children,
    onRename,
    onDelete,
}: ListProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!menuOpen) return;

        function closeMenu(event: PointerEvent) {
            if (!menuRef.current?.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }

        document.addEventListener("pointerdown", closeMenu);
        return () => document.removeEventListener("pointerdown", closeMenu);
    }, [menuOpen]);
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: `list-${id}`,
        data: {
            type: "list",
            id,
        },
        transition: {
            duration: 200,
            easing: "cubic-bezier(0.25, 1, 0.5, 1)",
        },
    });

    const {
        setNodeRef: setDroppableNodeRef,
        isOver,
    } = useDroppable({
        id: `list-drop-${id}`,
        data: {
            type: "list-drop",
            listId: id,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        willChange: "transform",
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="
                flex shrink-0 max-h-[80vh] w-[250px] flex-col
                rounded-xl bg-gray-100 p-2 shadow-md
            "
        >
            <div
                {...attributes}
                {...listeners}
                className="
                    mb-2 ps-2 flex shrink-0
                    items-center justify-between
                    cursor-grab active:cursor-grabbing
                "
            >
                {isRenaming ? (
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            const trimmedTitle = newTitle.trim();

                            if (trimmedTitle && trimmedTitle !== title) {
                                onRename?.(trimmedTitle);
                            }

                            setNewTitle(trimmedTitle || title);
                            setIsRenaming(false);
                        }}
                        onClick={(event) => event.stopPropagation()}
                        className="flex min-w-0 flex-1"
                    >
                        <input
                            autoFocus
                            value={newTitle}
                            onChange={(event) => setNewTitle(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Escape") {
                                    event.preventDefault();
                                    setNewTitle(title);
                                    setIsRenaming(false);
                                }
                            }}
                            className="min-w-0 w-full rounded border border-gray-300 bg-white px-1 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                            aria-label="List name"
                        />
                    </form>
                ) : (
                    <h4 className="min-w-0 truncate text-sm font-bold">
                        {title}
                    </h4>
                )}

                <div ref={menuRef} className="relative ml-2 shrink-0">
                    <button
                        type="button"
                        aria-label={`Actions for ${title}`}
                        aria-expanded={menuOpen}
                        onClick={(event) => {
                            event.stopPropagation();
                            setMenuOpen((current) => !current);
                        }}
                        className="rounded px-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                    >
                        ...
                    </button>

                    {menuOpen && (
                        <div
                            onClick={(event) => event.stopPropagation()}
                            className="absolute right-0 top-7 z-20 w-28 overflow-hidden rounded-md bg-white py-1 text-sm shadow-lg"
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    setMenuOpen(false);
                                    setNewTitle(title);
                                    setIsRenaming(true);
                                }}
                                className="w-full px-3 py-2 text-left hover:bg-gray-100"
                            >
                                Rename
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setMenuOpen(false);
                                    onDelete?.();
                                }}
                                className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div
                ref={setDroppableNodeRef}
                className={`
                    min-h-[40px]
                    overflow-y-auto
                    overflow-x-hidden
                    scrollbar-thin
                    pe-1
                    rounded-lg
                    ${isOver ? "bg-gray-200/60" : ""}
                `}
            >
                {children}
            </div>
        </div>
    );
}