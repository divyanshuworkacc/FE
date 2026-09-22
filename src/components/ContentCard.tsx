import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ContentCardProps {
    id: number;
    listId: number;
    className?: string;
    title: string;
    description?: string;
    src?: string;
    tags?: string[];
    deadline?: string;
    completed?: boolean;
    onCompletedChange?: () => void;
    onOpen?: () => void;
}

export default function ContentCard({
    id,
    listId,
    title,
    description,
    className = "",
    tags = [],
    deadline,
    completed = false,
    onCompletedChange,
    onOpen,
}: ContentCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: `card-${id}`,
        data: {
            type: "card",
            id,
            listId,
        },
        transition: {
            duration: 200,
            easing: "cubic-bezier(0.25, 1, 0.5, 1)",
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onOpen}
            title={description}
            className={`
                group relative rounded-lg
                p-2 mb-2 text-left shadow-sm
                ${isDragging ? "bg-gray-300" : "bg-white"}
                ${className}
            `}
        >
            <input
                type="checkbox"
                checked={completed}
                onChange={onCompletedChange}
                onPointerDown={(event) => {
                    event.stopPropagation();
                }}
                onClick={(event) => {
                    event.stopPropagation();
                }}
                className="
                    peer absolute
                    left-2 top-[11px]
                    h-4 w-4
                    cursor-pointer

                    opacity-0
                    transition-all
                    duration-300
                    ease-in-out

                    group-hover:opacity-100
                    checked:opacity-100

                    accent-blue-600
                "
            />

            <div className="min-w-0 overflow-hidden cursor-pointer">
                <p
                    className={`
                        pr-6
                        break-words
                        transition-transform
                        duration-300
                        ease-in-out

                        group-hover:translate-x-6

                        ${completed ? "translate-x-6 text-gray-400 line-through" : ""}
                    `}
                >
                    {title}
                </p>

                {tags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="
                                    rounded
                                    bg-blue-100
                                    px-1.5 py-0.5
                                    text-[10px]
                                    text-blue-700
                                "
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {deadline && (
                    <div
                        className="
                            mt-2
                            border-t border-gray-100
                            pt-1
                            text-[10px]
                            text-gray-500
                        "
                    >
                        Due{" "}
                        {new Date(
                            `${deadline}T00:00:00`
                        ).toLocaleDateString()}
                    </div>
                )}
            </div>
        </div>
    );
}