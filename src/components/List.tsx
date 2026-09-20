import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ListProps {
    id: number;
    title: string;
    children?: React.ReactNode;
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

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
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

                <button className="text-gray-500 hover:text-gray-700">
                    ...
                </button>
            </div>

            <div className="
                min-h-0
                overflow-y-auto
                overflow-x-hidden
                scrollbar-thin
                pe-1
            ">
                {children}
            </div>
        </div>
    );
}