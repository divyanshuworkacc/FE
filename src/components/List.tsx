import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import type { ReactNode } from "react";

interface ListProps {
    id: number;
    title: string;
    children?: ReactNode;
}

export default function List({
    id,
    title,
    children,
}: ListProps) {
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
                <h4 className="text-sm font-bold">
                    {title}
                </h4>

                <button type="button" className="text-gray-500 hover:text-gray-700">
                    ...
                </button>
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