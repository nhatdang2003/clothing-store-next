import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    loading?: boolean;
    showInfo?: boolean;
    totalItems?: number;
    itemsPerPage?: number;
    className?: string;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    loading = false,
    className = ""
}: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className={`flex justify-center items-center space-x-2 ${className}`}>
            <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1 || loading}
                onClick={() => onPageChange(currentPage - 1)}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-sm text-gray-600">
                Trang {currentPage} / {totalPages}
            </span>

            <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages || loading}
                onClick={() => onPageChange(currentPage + 1)}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
} 