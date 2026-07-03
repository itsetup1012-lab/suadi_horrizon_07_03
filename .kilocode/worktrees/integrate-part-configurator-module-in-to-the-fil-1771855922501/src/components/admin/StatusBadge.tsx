interface StatusBadgeProps {
    status: string;
}

const statusStyles: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
    processing: 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
    shipped: 'bg-purple-500/10 text-purple-500 border border-purple-500/20',
    delivered: 'bg-green-500/10 text-green-500 border border-green-500/20',
    cancelled: 'bg-red-500/10 text-red-500 border border-red-500/20',
    active: 'bg-green-500/10 text-green-500 border border-green-500/20',
    inactive: 'bg-slate-500/10 text-slate-500 border border-slate-500/20',
    approved: 'bg-green-500/10 text-green-500 border border-green-500/20',
    rejected: 'bg-red-500/10 text-red-500 border border-red-500/20',
    default: 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
};

export function StatusBadge({ status }: StatusBadgeProps) {
    const normalizedStatus = status?.toLowerCase() || 'default';
    const style = statusStyles[normalizedStatus] || statusStyles.default;

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${style}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}
