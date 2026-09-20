import ContentCard from "../components/ContentCard";
import List from "../components/List";

import { useRef, useState } from "react";

import {
    DndContext,
    DragOverlay,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
    type CollisionDetection,
} from "@dnd-kit/core";

import {
    SortableContext,
    horizontalListSortingStrategy,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";

export default function Board() {
    const [addingToList, setAddingToList] = useState<number | null>(null);
    const [newCardTitle, setNewCardTitle] = useState("");

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [activeId, setActiveId] = useState<
        string | number | null
    >(null);

    const [lists, setLists] = useState([
        { id: 1, title: "List 1" },
        { id: 2, title: "List 2" },
        { id: 3, title: "List 3" },
    ]);

    const [contents, setContents] = useState([
        {
            id: 1,
            listId: 1,
            title: "Content 1",
            description: "This is the first content",
        },
        {
            id: 2,
            listId: 1,
            title: "Content 2",
            description: "This is the second content",
        },
        {
            id: 3,
            listId: 2,
            title: "Content 3",
            description: "This is the third content",
        },
        {
            id: 4,
            listId: 2,
            title: "Content 4",
            description: "This is the fourth content",
        },
        {
            id: 5,
            listId: 3,
            title: "Content 5",
            description: "This is the fifth content",
        },
        {
            id: 6,
            listId: 3,
            title: "Content 6",
            description: "This is the sixth content",
        },
        {
            id: 7,
            listId: 1,
            title: "Content 7",
            description: "This is the seventh content",
        },
        {
            id: 8,
            listId: 2,
            title: "Content 8",
            description: "This is the eighth content",
        },
        {
            id: 9,
            listId: 3,
            title: "Content 9",
            description: "This is the ninth content",
        },
        {
            id: 10,
            listId: 1,
            title: "Content 10",
            description: "This is the tenth content",
        },
    ]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const collisionDetectionStrategy: CollisionDetection = (args) => {
        const activeType = args.active.data.current?.type;

        if (activeType === "list") {
            return closestCenter({
                ...args,
                droppableContainers:
                    args.droppableContainers.filter(
                        (container) =>
                            container.data.current?.type === "list"
                    ),
            });
        }

        return closestCenter({
            ...args,
            droppableContainers:
                args.droppableContainers.filter((container) => {
                    const type = container.data.current?.type;

                    return (
                        type === "card" ||
                        type === "list-drop"
                    );
                }),
        });
    };

    function handleDragStart(event: any) {
        setActiveId(event.active.id);
    }

    function handleDragOver(event: any) {
        const { active, over } = event;

        if (!over) return;

        if (active.data.current?.type !== "card") {
            return;
        }

        const activeCardId = active.data.current.id;
        const overType = over.data.current?.type;

        setContents((currentContents) => {
            const activeIndex = currentContents.findIndex(
                (content) => content.id === activeCardId
            );

            if (activeIndex === -1) {
                return currentContents;
            }

            const activeCard = currentContents[activeIndex];

            if (overType === "list-drop") {
                const targetListId = over.data.current?.listId;

                if (
                    targetListId === undefined ||
                    activeCard.listId === targetListId
                ) {
                    return currentContents;
                }

                return currentContents.map((content) =>
                    content.id === activeCardId
                        ? {
                            ...content,
                            listId: targetListId,
                        }
                        : content
                );
            }

            if (overType === "card") {
                const overCardId = over.data.current?.id;

                const overIndex = currentContents.findIndex(
                    (content) => content.id === overCardId
                );

                if (overIndex === -1) {
                    return currentContents;
                }

                const overCard = currentContents[overIndex];

                if (activeCard.listId === overCard.listId) {
                    return currentContents;
                }

                const updatedContents = currentContents.map(
                    (content) =>
                        content.id === activeCardId
                            ? {
                                ...content,
                                listId: overCard.listId,
                            }
                            : content
                );

                return arrayMove(
                    updatedContents,
                    activeIndex,
                    overIndex
                );
            }

            return currentContents;
        });
    }

    function handleDragEnd(event: any) {
        const { active, over } = event;

        setActiveId(null);

        if (!over || active.id === over.id) return;

        if (active.data.current?.type === "list") {
            const activeListId = active.data.current.id;
            const overListId = over.data.current?.id;

            if (overListId === undefined) return;

            setLists((currentLists) => {
                const oldIndex = currentLists.findIndex(
                    (list) => list.id === activeListId
                );

                const newIndex = currentLists.findIndex(
                    (list) => list.id === overListId
                );

                if (oldIndex === -1 || newIndex === -1) {
                    return currentLists;
                }

                return arrayMove(
                    currentLists,
                    oldIndex,
                    newIndex
                );
            });

            return;
        }

        if (active.data.current?.type === "card") {
            const activeCardId = active.data.current.id;
            const overCardId = over.data.current?.id;

            if (overCardId === undefined) return;

            setContents((currentContents) => {
                const activeCard = currentContents.find(
                    (content) =>
                        content.id === activeCardId
                );

                const overCard = currentContents.find(
                    (content) =>
                        content.id === overCardId
                );

                if (!activeCard || !overCard) {
                    return currentContents;
                }

                if (activeCard.listId !== overCard.listId) {
                    return currentContents;
                }

                const oldIndex = currentContents.findIndex(
                    (content) =>
                        content.id === activeCardId
                );

                const newIndex = currentContents.findIndex(
                    (content) =>
                        content.id === overCardId
                );

                return arrayMove(
                    currentContents,
                    oldIndex,
                    newIndex
                );
            });
        }
    }

    function handleDragCancel() {
        setActiveId(null);
    }

    function addList() {
        const newList = {
            id: lists.length + 1,
            title: `List ${lists.length + 1}`,
        };

        setLists((currentLists) => [
            ...currentLists,
            newList,
        ]);
    }

    function addCard(listId: number) {
        if (!newCardTitle.trim()) return;

        const newContent = {
            id: contents.length + 1,
            listId,
            title: newCardTitle,
            description: "",
        };

        setContents((currentContents) => [
            ...currentContents,
            newContent,
        ]);

        setNewCardTitle("");

        requestAnimationFrame(() => {
            textareaRef.current?.focus();
        });
    }

    const activeCard = contents.find(
        (content) => `card-${content.id}` === activeId
    );

    const activeList = lists.find(
        (list) => `list-${list.id}` === activeId
    );

    return (
        <div className="
            h-full w-full min-w-0
            overflow-x-auto overflow-y-hidden
            scrollbar-thin
        ">
            <DndContext
                sensors={sensors}
                collisionDetection={collisionDetectionStrategy}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
                <SortableContext
                    items={lists.map(
                        (list) => `list-${list.id}`
                    )}
                    strategy={horizontalListSortingStrategy}
                >
                    <div className="
                        flex w-max min-w-full
                        items-start gap-4 p-4
                    ">
                        {lists.map((list) => {
                            const listContents =
                                contents.filter(
                                    (content) =>
                                        content.listId === list.id
                                );

                            return (
                                <List
                                    key={list.id}
                                    id={list.id}
                                    title={list.title}
                                >
                                    <SortableContext
                                        items={listContents.map(
                                            (content) =>
                                                `card-${content.id}`
                                        )}
                                        strategy={
                                            verticalListSortingStrategy
                                        }
                                    >
                                        {listContents.map(
                                            (content) => (
                                                <ContentCard
                                                    key={content.id}
                                                    id={content.id}
                                                    listId={
                                                        content.listId
                                                    }
                                                    title={
                                                        content.title
                                                    }
                                                    description={
                                                        content.description
                                                    }
                                                />
                                            )
                                        )}
                                    </SortableContext>

                                    {addingToList === list.id ? (
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                addCard(list.id);
                                            }}
                                            className="
                                                rounded-lg
                                                bg-white p-2 mb-2
                                                text-left shadow-sm
                                            "
                                        >
                                            <textarea
                                                ref={textareaRef}
                                                autoFocus
                                                value={newCardTitle}
                                                onChange={(e) =>
                                                    setNewCardTitle(
                                                        e.target.value
                                                    )
                                                }
                                                onKeyDown={(e) => {
                                                    if (
                                                        e.key ===
                                                            "Enter" &&
                                                        !e.shiftKey
                                                    ) {
                                                        e.preventDefault();
                                                        e.currentTarget.form?.requestSubmit();
                                                    }
                                                }}
                                                onInput={(e) => {
                                                    const textarea =
                                                        e.currentTarget;

                                                    textarea.style.height =
                                                        "auto";

                                                    textarea.style.height =
                                                        `${textarea.scrollHeight}px`;
                                                }}
                                                placeholder="Enter card title..."
                                                rows={2}
                                                className="
                                                    w-full
                                                    resize-none
                                                    overflow-hidden
                                                    box-border
                                                    leading-5
                                                    bg-transparent
                                                    outline-none
                                                "
                                            />
                                        </form>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                setAddingToList(
                                                    list.id
                                                )
                                            }
                                            className="
                                                flex w-full
                                                items-center
                                                rounded-lg
                                                bg-white p-2 mb-2
                                                text-left shadow-sm
                                            "
                                        >
                                            + Add new card
                                        </button>
                                    )}
                                </List>
                            );
                        })}

                        <button
                            onClick={addList}
                            className="
                                w-[250px] shrink-0
                                rounded-xl
                                bg-gray-100/70
                                p-2 shadow-md
                            "
                        >
                            + Add new list
                        </button>
                    </div>
                </SortableContext>

                <DragOverlay>
                    {activeCard ? (
                        <div className="
                            w-[234px]
                            rounded-lg
                            bg-white
                            p-2
                            shadow-lg
                            cursor-grabbing
                        ">
                            <p className="break-words">
                                {activeCard.title}
                            </p>
                        </div>
                    ) : activeList ? (
                        <div className="
                            w-[250px]
                            max-h-[80vh]
                            overflow-hidden
                            rounded-xl
                            bg-gray-100
                            p-2
                            shadow-xl
                            cursor-grabbing
                        ">
                            <div className="
                                mb-2 ps-2
                                text-sm font-bold
                            ">
                                {activeList.title}
                            </div>

                            {contents
                                .filter(
                                    (content) =>
                                        content.listId ===
                                        activeList.id
                                )
                                .map((content) => (
                                    <div
                                        key={content.id}
                                        className="
                                            mb-2
                                            rounded-lg
                                            bg-white
                                            p-2
                                            shadow-sm
                                        "
                                    >
                                        {content.title}
                                    </div>
                                ))}
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}