import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import { abstract } from "devstract";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    writeBatch,
} from "firebase/firestore";

type BoardCard = {
    id: string;
    title: string;
    description: string;
    seed: number;
    isEditing?: boolean;
};

const initialCards: BoardCard[] = [
    { id: "initial-1", title: "Card 1", description: "This is the first card", seed: 1 },
]

export default function Boards() {
    const { user } = useAuth();
    const [cards, setCards] = useState<BoardCard[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const seededRef = useRef(false);
    const ignoreBlurRef = useRef(false);

    useEffect(() => {
        if (!user) return;

        const boardsRef = collection(db, "users", user.uid, "boards");
        const boardsQuery = query(boardsRef, orderBy("createdAt", "asc"));

        return onSnapshot(boardsQuery, async (snapshot) => {
            if (snapshot.empty && !seededRef.current) {
                seededRef.current = true;
                const batch = writeBatch(db);

                initialCards.forEach((card) => {
                    batch.set(doc(boardsRef, card.id), {
                        ...card,
                        isEditing: false,
                        createdAt: serverTimestamp(),
                    });
                });

                await batch.commit();
                return;
            }

            setCards(
                snapshot.docs.map((board) => {
                    // "estimate" avoids the new card briefly sorting to the
                    // top while its serverTimestamp() is still resolving
                    const data = board.data({ serverTimestamps: "estimate" });
                    return {
                        id: board.id,
                        title: data.title,
                        description: data.description,
                        seed: data.seed,
                        isEditing: data.isEditing,
                    };
                })
            );
        });
    }, [user]);

    useEffect(() => {
        if (cards.some((card) => card.isEditing)) {
            inputRef.current?.focus();
        }
    }, [cards]);

    async function handleAddCard() {
        if (cards.some((c) => c.isEditing)) return;

        if (!user) return;

        const newCard = await addDoc(collection(db, "users", user.uid, "boards"), {
            title: "",
            description: "",
            seed: Math.floor(Math.random() * 1000),
            isEditing: true,
            createdAt: serverTimestamp(),
        });

        return newCard.id;
    }

    function commitTitle(id: string, rawTitle: string) {
        const title = rawTitle.trim();

        if (!user) return;

        const cardRef = doc(db, "users", user.uid, "boards", id);

        if (!title) {
            void deleteDoc(cardRef);
            return;
        }

        void updateDoc(cardRef, { title, isEditing: false });
    }

    function cancelEditing(id: string) {
        if (!user) return;
        void deleteDoc(doc(db, "users", user.uid, "boards", id));
    }

    return (
        <div
            className="boards grid min-h-0 flex-1 content-start auto-rows-max grid-cols-[repeat(auto-fit,minmax(200px,200px))] items-start justify-center gap-3 overflow-auto bg-cover bg-center p-3"
            style={{
                backgroundImage: `url("${abstract({
                    width: 1920,
                    height: 1080,
                    seed: "123",
                    style: "geometric",
                    palette: "ocean",
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
                                    e.preventDefault();
                                    e.currentTarget.blur();
                                } else if (e.key === "Escape") {
                                    e.preventDefault();
                                    ignoreBlurRef.current = true;
                                    e.currentTarget.blur();
                                    cancelEditing(card.id);
                                    ignoreBlurRef.current = false;
                                }
                            }}
                            onBlur={(e) => {
                                if (ignoreBlurRef.current) return;
                                commitTitle(card.id, e.currentTarget.value);
                            }}
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
                                height: 75,
                                blobs: 2,
                                seed: card.seed,
                                opacity: 1,
                                style: "geometric",
                                palette: "pastel"
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