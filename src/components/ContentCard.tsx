interface ContentCardProps {
    title: string;
}

export default function ContentCard({ title }: ContentCardProps) {
    return (
        <div className="group relative flex items-center overflow-hidden rounded-lg bg-white p-2 mb-2 text-left shadow-sm">

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
                    w-[calc(100%-1.5rem)]
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