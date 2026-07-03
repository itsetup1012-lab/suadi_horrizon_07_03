import { ReactNode, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Column<T> {
    key: string;
    header: string;
    render?: (item: T) => ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    pageSize?: number;
    searchable?: boolean;
    searchKeys?: (keyof T)[];
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
}

export function DataTable<T extends { id: string | number }>({
    data,
    columns,
    pageSize = 10,
    searchable = true,
    searchKeys = [],
    onEdit,
    onDelete,
}: DataTableProps<T>) {
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [page, setPage] = useState(0);

    // Filter
    const filteredData = search && searchable
        ? data.filter((item) => {
            const searchLower = search.toLowerCase();
            if (searchKeys.length > 0) {
                return searchKeys.some((key) => {
                    const value = item[key];
                    return String(value).toLowerCase().includes(searchLower);
                });
            }
            return Object.values(item).some((val) =>
                String(val).toLowerCase().includes(searchLower)
            );
        })
        : data;

    // Sort
    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortKey) return 0;
        const aVal = String(a[sortKey as keyof typeof a]).toLowerCase();
        const bVal = String(b[sortKey as keyof typeof b]).toLowerCase();
        return sortOrder === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
    });

    // Paginate
    const totalPages = Math.ceil(sortedData.length / pageSize);
    const paginatedData = sortedData.slice(
        page * pageSize,
        (page + 1) * pageSize
    );

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    const goToPage = (p: number) => {
        setPage(Math.max(0, Math.min(p, totalPages - 1)));
    };

    return (
        <div className="space-y-4">
            {/* Search */}
            {searchable && (
                <div className="flex items-center justify-between">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(0);
                        }}
                        className="max-w-sm bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
            )}

            {/* Table */}
            <div className="rounded-lg border border-gray-700 bg-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-700/50">
                            <tr>
                                {columns.map((col) => (
                                    <th
                                        key={col.key}
                                        className={cn(
                                            "px-4 py-3 text-left text-sm font-semibold text-gray-200 cursor-pointer hover:bg-gray-700/70 transition-colors",
                                            col.className
                                        )}
                                        onClick={() => handleSort(col.key)}
                                    >
                                        <div className="flex items-center gap-2">
                                            {col.header}
                                            {sortKey === col.key && (
                                                <ArrowUpDown
                                                    className={cn(
                                                        "h-4 w-4 text-primary",
                                                        sortOrder === "desc" && "rotate-180"
                                                    )}
                                                />
                                            )}
                                        </div>
                                    </th>
                                ))}
                                {(onEdit || onDelete) && (
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-200">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-t border-gray-700 hover:bg-gray-700/30 transition-colors"
                                    >
                                        {columns.map((col) => (
                                            <td
                                                key={col.key}
                                                className={cn("px-4 py-3 text-sm text-gray-300", col.className)}
                                            >
                                                {col.render
                                                    ? col.render(item)
                                                    : String(item[col.key as keyof typeof item] ?? "")}
                                            </td>
                                        ))}
                                        {(onEdit || onDelete) && (
                                            <td className="px-4 py-3 text-sm">
                                                <div className="flex items-center gap-2">
                                                    {onEdit && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => onEdit(item)}
                                                            className="text-primary hover:text-primary/80 hover:bg-primary/10"
                                                        >
                                                            Edit
                                                        </Button>
                                                    )}
                                                    {onDelete && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => onDelete(item)}
                                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                        >
                                                            Delete
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length + ((onEdit || onDelete) ? 1 : 0)}
                                        className="px-4 py-8 text-center text-gray-400"
                                    >
                                        No results found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                    {/* Page info */}
                    <div className="text-sm text-gray-400">
                        Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, sortedData.length)} of {sortedData.length} entries
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => goToPage(0)}
                            disabled={page === 0}
                            className="h-8 w-8 border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 0}
                            className="h-8 w-8 border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {/* Page numbers */}
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum: number;
                                if (totalPages <= 5) {
                                    pageNum = i;
                                } else if (page < 2) {
                                    pageNum = i;
                                } else if (page > totalPages - 3) {
                                    pageNum = totalPages - 5 + i;
                                } else {
                                    pageNum = page - 2 + i;
                                }
                                return (
                                    <Button
                                        key={pageNum}
                                        variant={page === pageNum ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => goToPage(pageNum)}
                                        className={cn(
                                            "h-8 w-8",
                                            page === pageNum
                                                ? "bg-primary text-white"
                                                : "border-gray-600 text-gray-300 hover:bg-gray-700"
                                        )}
                                    >
                                        {pageNum + 1}
                                    </Button>
                                );
                            })}
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPage(page + 1)}
                            disabled={page === totalPages - 1}
                            className="h-8 w-8 border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => goToPage(totalPages - 1)}
                            disabled={page === totalPages - 1}
                            className="h-8 w-8 border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
