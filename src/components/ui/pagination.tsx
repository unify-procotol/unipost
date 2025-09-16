'use client';

import { useState } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  showPageSizeSelector?: boolean;
  className?: string;
}

const PAGE_SIZE_OPTIONS = [10, 15, 20, 50];

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  showPageSizeSelector = true,
  className = '',
}: PaginationProps) {
  const [isChangingPageSize, setIsChangingPageSize] = useState(false);

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Always include first page
    range.push(1);

    // Add pages around current page
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    // Always include last page if there are multiple pages
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Remove duplicates and sort
    const uniqueRange = [...new Set(range)].sort((a, b) => a - b);

    // Add dots where there are gaps
    for (let i = 0; i < uniqueRange.length; i++) {
      if (i === 0) {
        rangeWithDots.push(uniqueRange[i]);
      } else if (uniqueRange[i] - uniqueRange[i - 1] === 2) {
        rangeWithDots.push(uniqueRange[i - 1] + 1);
        rangeWithDots.push(uniqueRange[i]);
      } else if (uniqueRange[i] - uniqueRange[i - 1] !== 1) {
        rangeWithDots.push('...');
        rangeWithDots.push(uniqueRange[i]);
      } else {
        rangeWithDots.push(uniqueRange[i]);
      }
    }

    return rangeWithDots;
  };

  const handlePageSizeChange = async (newPageSize: number) => {
    if (!onPageSizeChange) return;
    
    setIsChangingPageSize(true);
    try {
      await onPageSizeChange(newPageSize);
    } finally {
      setIsChangingPageSize(false);
    }
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  if (totalPages <= 1 && !showPageSizeSelector) {
    return null;
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Results summary */}
      <div className="text-sm text-gray-600">
        {totalItems > 0 ? (
          <>
            Showing <span className="font-medium text-gray-900">{startItem}</span> to{' '}
            <span className="font-medium text-gray-900">{endItem}</span> of{' '}
            <span className="font-medium text-gray-900">{totalItems}</span> posts
          </>
        ) : (
          'No posts found'
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Page size selector */}
        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <label htmlFor="pageSize" className="text-sm text-gray-600">
              Show:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
              disabled={isChangingPageSize}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              aria-label="Posts per page"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <nav className="flex items-center gap-1" aria-label="Pagination Navigation">
            {/* Previous button */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 transition-all duration-150 cursor-pointer"
              aria-label="Go to previous page"
            >
              Previous
            </button>

            {/* Page numbers */}
            <div className="hidden sm:flex items-center gap-1">
              {getVisiblePages().map((page, index) => (
                <span key={index}>
                  {page === '...' ? (
                    <span className="px-3 py-2 text-sm text-gray-600">...</span>
                  ) : (
                    <button
                      onClick={() => onPageChange(page as number)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 cursor-pointer ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border border-blue-600 shadow-md active:bg-blue-700 active:scale-95'
                          : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm active:bg-gray-200 active:scale-95'
                      }`}
                      aria-label={`Go to page ${page}`}
                      aria-current={currentPage === page ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  )}
                </span>
              ))}
            </div>

            {/* Mobile page indicator */}
            <div className="sm:hidden px-3 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg">
              {currentPage} / {totalPages}
            </div>

            {/* Next button */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 transition-all duration-150 cursor-pointer"
              aria-label="Go to next page"
            >
              Next
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}