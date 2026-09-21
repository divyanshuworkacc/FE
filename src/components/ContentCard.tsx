import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ContentCardProps {
    id: number;
    listId: number;
    className?: string;
    title: string;
    description?: string;
    src?: string;
}

export default function ContentCard({
    id,
    listId,
    title,
    description,
    className = "",
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
            title={description}
            className={`
                group relative flex items-center rounded-lg
                p-2 mb-2 text-left shadow-sm
                ${isDragging ? "bg-gray-300" : "bg-white"}
                ${className}
            `}
        >
            <input
                type="checkbox"
                className="
                    peer absolute left-2
                    opacity-0
                    transition-opacity duration-300 ease-in-out
                    group-hover:opacity-100
                    checked:opacity-100
                "
            />

            <p
                className="
                    min-w-0 flex-1
                    transition-transform duration-300 ease-in-out
                    group-hover:translate-x-6
                    peer-checked:translate-x-6
                    break-words
                "
            >
                {title}
            </p>
        </div>
    );
}