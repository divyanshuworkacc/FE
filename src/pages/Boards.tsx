import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import { abstract } from "devstract";

type BoardCard = {
    id: number;
    title: string;
    description: string;
    seed: number;
    isEditing?: boolean;
};

const initialCards: BoardCard[] = [
    { id: 1, title: "Card 1", description: "This is the first card", seed: 1 },
]

let nextId = initialCards.length + 1;

export default function Boards() {
    const [cards, setCards] = useState<BoardCard[]>(initialCards);
    const inputRef = useRef<HTMLInputElement>(null);

    function handleAddCard() {
        if (cards.some((c) => c.isEditing)) return;

        const newCard: BoardCard = {
            id: nextId++,
            title: "",
            description: "",
            seed: Math.floor(Math.random() * 1000),
            isEditing: true,
        };
        setCards((prev) => [...prev, newCard]);
        requestAnimationFrame(() => inputRef.current?.focus());
    }

    function commitTitle(id: number, rawTitle: string) {
        const title = rawTitle.trim();

        if (!title) {
            setCards((prev) => prev.filter((c) => c.id !== id));
            return;
        }

        setCards((prev) =>
            prev.map((c) => (c.id === id ? { ...c, title, isEditing: false } : c))
        );
    }

    function cancelEditing(id: number) {
        setCards((prev) => prev.filter((c) => c.id !== id));
    }

    return (
        <div
            className="boards grid min-h-0 flex-1 content-start auto-rows-max grid-cols-[repeat(auto-fit,minmax(200px,200px))] items-start justify-center gap-3 overflow-auto bg-cover bg-center p-3"
            style={{
                backgroundImage: `url("${abstract({
                    width: 1920,
                    height: 1080,
                    seed: "12345",
                    style: "waves",
                    palette: "sunset",
                })}")`,
            }}
        >
            {cards.map((card) =>
                card.isEditing ? (
                    <div
                        key={card.id}
                        className="card flex w-[200px] flex-col overflow-hidden rounded-lg bg-white shadow"
                    >
                        <div
                            className="h-[75px] w-full"
                            style={{
                                backgroundImage: `url("${abstract({
                                    width: 200,
                                    blobs: 2,
                                    height: 75,
                                    seed: card.seed,
                                    opacity: 1,
                                    palette: "sunset",
                                })}")`,
                                backgroundSize: "cover",
                            }}
                        />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Enter card title"
                            defaultValue={card.title}
                            className="w-full border-none p-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    commitTitle(card.id, e.currentTarget.value);
                                } else if (e.key === "Escape") {
                                    cancelEditing(card.id);
                                }
                            }}
                            onBlur={(e) => commitTitle(card.id, e.currentTarget.value)}
                        />
                    </div>
                ) : (
                    <Link to={`/boards/${card.id}`} key={card.id} className="block w-[200px]">
                        <Card
                            className="card w-full"
                            title={card.title}
                            description={card.description}
                            src={abstract({
                                width: 200,
                                blobs: 2,
                                height: 75,
                                seed: card.seed,
                                opacity: 1,
                                palette: "sunset",
                            })}
                        />
                    </Link>
                )
            )}

            <button
                type="button"
                onClick={handleAddCard}
                className="add-card group relative w-[200px]"
                aria-label="Add new card"
            >
                <Card
                    className="card"
                    title="Add new card"
                    description=""
                    src={abstract({ width: 200, height: 75, seed: 30, opacity: 1, palette: "sunset" })}
                />
                
                <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[75px] items-center justify-center rounded-t-lg bg-black/35 backdrop-blur-sm">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-dashed border-white text-xl leading-none text-white">
                        +
                    </span>
                </div>
            </button>
        </div>
    );
}