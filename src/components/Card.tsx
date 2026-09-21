

interface CardProps {
    className?: string;
    title: string;
    description: string;
    src: string;
}



export default function Card({
    className = "",
    title,
    description,
    src,
}: CardProps) {
    return (
        <div
            className={`overflow-hidden rounded-lg bg-white shadow-md ${className}`}
            title={description}
        >
            <img src={src} alt={title} />

            <div className="p-2">
                <h2>{title}</h2>
            </div>
        </div>
    );
}