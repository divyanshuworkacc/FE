

import Card from "../components/Card";
import { abstract } from "devstract";

const fakeCards = [
    { title: "Card 1", description: "This is the first card", seed: 1 },
    { title: "Card 2", description: "This is the second card", seed: 2 },
    { title: "Card 3", description: "This is the fourth card", seed: 3},
    { title: "Card 4", description: "This is the fifth card", seed: 4},
    { title: "Card 5", description: "This is the sixth card", seed: 5},
    { title: "Card 1", description: "This is the first card", seed: 1 },
    { title: "Card 2", description: "This is the second card", seed: 2 },
    { title: "Card 3", description: "This is the fourth card", seed: 3},
    { title: "Card 4", description: "This is the fifth card", seed: 4},
    { title: "Card 5", description: "This is the sixth card", seed: 5},
    { title: "Card 1", description: "This is the first card", seed: 1 },
    { title: "Card 2", description: "This is the second card", seed: 2 },
    { title: "Card 3", description: "This is the fourth card", seed: 3},
    { title: "Card 4", description: "This is the fifth card", seed: 4},
    { title: "Card 5", description: "This is the sixth card", seed: 5},
]


export default function Boards() {



    return (
        <div className="boards flex flex-wrap gap-3 p-3">
            {fakeCards.map((card, index) => (
                <Card className="card"
                    key={index}
                    title={card.title}
                    description={card.description}
                    src={abstract({ width: 250, blobs:2,  height: 150, seed: card.seed })}
                />
            ))}
            <button>
                <Card className="card"
                    title="Add new card"
                    description="Create a new card"
                    src={abstract({ width: 250, height: 150, seed: 30, opacity: 1 })}
                />
            </button>
            
        </div>
    )
}