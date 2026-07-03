import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: string;
        positive: boolean;
    };
    onClick?: () => void;
    className?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, onClick, className }: StatsCardProps) {
    return (
        <div
            className={cn(
                "bg-gray-800 border border-gray-700 rounded-xl p-6 transition-all duration-200",
                onClick && "cursor-pointer hover:border-primary hover:shadow-lg hover:shadow-primary/10"
            )}
            onClick={onClick}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-400">{title}</p>
                    <p className="text-3xl font-bold text-white mt-1">{value}</p>
                    {trend && (
                        <p className={`text-sm mt-2 ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
                            {trend.positive ? '↑' : '↓'} {trend.value} from last month
                        </p>
                    )}
                </div>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                </div>
            </div>
        </div>
    );
}
