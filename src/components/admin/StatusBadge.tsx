interface StatusBadgeProps {
    status: string;
}

const statusStyles: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    processing: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    shipped: 'bg-gold/10 text-gold border border-gold/20',
    delivered: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border border-red-500/20',
    active: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    inactive: 'bg-white/5 text-white/40 border border-white/10',
    approved: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    rejected: 'bg-red-500/10 text-red-400 border border-red-500/20',
    default: 'bg-white/5 text-white/40 border border-white/10'
};

export function StatusBadge({ status }: StatusBadgeProps) {
    const normalizedStatus = status?.toLowerCase() || 'default';
    const style = statusStyles[normalizedStatus] || statusStyles.default;

    return (
        <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] shadow-sm ${style}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 animate-pulse" />
            {status}
        </span>
    );
}
