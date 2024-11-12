// src/components/ui/pagination.tsx
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5; // Number of pages to show
    let start = Math.max(1, currentPage - 2);
    const end = Math.min(start + showPages - 1, totalPages);

    // Adjust start if we're near the end
    if (end === totalPages) {
      start = Math.max(1, end - showPages + 1);
    }

    // Add first page if not included
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    // Add page numbers
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add last page if not included
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 py-4">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        ‹
      </Button>

      <div className="flex gap-1">
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-3 py-2">...</span>
          ) : (
            <Button
              key={`page-${page}`}
              variant={page === currentPage ? "default" : "outline"}
              onClick={() => onPageChange(Number(page))}
            >
              {page}
            </Button>
          )
        ))}
      </div>

      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        ›
      </Button>
    </div>
  );
};

export default Pagination;