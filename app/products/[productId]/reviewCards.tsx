import RatingStars  from "@/components/shop/RatingStars";

export default function RatingCard({
    rating,
    description,
    name,
    date,
}: {
    rating: number;
    description: string;
    name: string;
    date: string;
}) {
    return (
        <div className="min-w-[400px] max-w-[400px] min-h-[200px] max-h-[400px] bg-white rounded-lg shadow-md p-4 m-2">
            <div className="flex-row ">
                <div className="text-lg font-semibold overflow-x-auto">
                    {name}
                </div>
                <div className="text-sm text-gray-400">{date}</div>
                <RatingStars rating={rating} />
                <div className="text-sm overflow-y-auto max-h-[300px]">
                    {description}
                </div>
            </div>
        </div>
    );
}