
import ContentCard from '../components/ContentCard'
import List from '../components/List'
import { useState, useRef } from 'react'

export default function Board() {
    const [addingToList, setAddingToList] = useState<number | null>(null);
    const [newCardTitle, setNewCardTitle] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [lists, setLists] = useState([
        { id: 1, title: "List 1" },
        { id: 2, title: "List 2" },
        { id: 3, title: "List 3" },
    ])

    const [contents, setContents] = useState([
        { id: 1, listId: 1, title: "Content 1", description: "This is the first content" },
        { id: 2, listId: 1, title: "Content 2", description: "This is the second content" },
        { id: 3, listId: 2, title: "Content 3", description: "This is the third content" },
        { id: 4, listId: 2, title: "Content 4", description: "This is the fourth content" },
        { id: 5, listId: 3, title: "Content 5", description: "This is the fifth content" },
        { id: 6, listId: 3, title: "Content 6", description: "This is the sixth content" },
        { id: 7, listId: 1, title: "Content 7", description: "This is the seventh content" },
        { id: 8, listId: 2, title: "Content 8", description: "This is the eighth content" },
        { id: 9, listId: 3, title: "Content 9", description: "This is the ninth content" },
        { id: 10, listId: 1, title: "Content 10", description: "This is the tenth content" },
    ])

    function addList() {
        const newList = { id: lists.length + 1, title: `List ${lists.length + 1}` }
        setLists([...lists, newList])
    }

    function addCard(listId: number) {
        if (!newCardTitle.trim()) return;

        const newContent = {
            id: contents.length + 1,
            listId,
            title: newCardTitle,
        };

        setContents((currentContents) => [...currentContents, newContent]);
        setNewCardTitle("");

        requestAnimationFrame(() => {
            textareaRef.current?.focus();
        });
    }

    return (
    <div className="h-full w-full min-w-0 overflow-x-auto overflow-y-hidden scrollbar-thin">
        <div className="flex w-max min-w-full items-start gap-4 p-4">

            {lists.map((list) => (
    <List key={list.id} title={list.title}>

            {contents
                .filter((content) => content.listId === list.id)
                .map((content) => (
                    <ContentCard
                        key={content.id}
                        title={content.title}
                    />
                ))}

            {addingToList === list.id ? (
               <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        addCard(list.id);
                    }}
                    className="rounded-lg bg-white p-2 mb-2 text-left shadow-sm"
                >
                    <textarea
                        ref={textareaRef}
                        autoFocus
                        value={newCardTitle}
                        onChange={(e) => setNewCardTitle(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                e.currentTarget.form?.requestSubmit();
                            }
                        }}
                        onInput={(e) => {
                            const textarea = e.currentTarget;

                            textarea.style.height = "auto";
                            textarea.style.height = `${textarea.scrollHeight}px`;
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
                    onClick={() => setAddingToList(list.id)}
                    className="flex w-full items-center rounded-lg bg-white p-2 mb-2 text-left shadow-sm"
                >
                    + Add new card
                </button>
            )}

        </List>
    ))}

            <button
                onClick={addList}
                className="w-[250px] shrink-0 rounded-xl bg-gray-100/70 p-2 shadow-md"
            >
                + Add new list
            </button>

        </div>
    </div>
);
}

