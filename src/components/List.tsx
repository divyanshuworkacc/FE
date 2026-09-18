

interface ListProps {
    title: string;
    children?: React.ReactNode;
}

export default function List({ title, children }: ListProps) {
    return (
        <div className="flex shrink-0 max-h-[80vh] w-[250px] flex-col rounded-xl bg-gray-100 p-2 shadow-md">
            <div className="mb-2 ps-2 flex shrink-0 items-center justify-between">
                <h4 className="text-sm font-bold">{title}</h4>
                <button className="text-gray-500 hover:text-gray-700">...</button>
            </div>

            <div className="min-h-0 overflow-y-auto scrollbar-thin pe-1 ">
                {children}
            </div>
        </div>
    );
}

