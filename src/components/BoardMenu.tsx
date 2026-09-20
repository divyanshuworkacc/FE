import Card from "./Card"


export default function BoardMenu() {
    const boards = [
        { id: 1, title: "Board 1", description: "This is the first board", src: "https://via.placeholder.com/150" },
        { id: 2, title: "Board 2", description: "This is the second board", src: "https://via.placeholder.com/150" },
        { id: 3, title: "Board 3", description: "This is the third board", src: "https://via.placeholder.com/150" },
    ]
    return (
        <div className="mx-w-800px mx-auto p-4 rounded-md shadow-md" >
            <input type="text" placeholder="Search..." className="w-full p-2 rounded-md border border-gray-300" />
            <div className="flex justify-between mt-4">
                {boards.map((board) => (
                    <Card
                        key={board.id}
                        title={board.title}
                        description={board.description}
                        src={board.src}
                    />
                ))}
            </div>
        </div>
    )
}