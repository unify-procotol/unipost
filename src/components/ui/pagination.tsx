"use client";

import { useState } from "react";
import Link from "next/link";
import CustomSelect from "./custom-select";
import { useTranslation } from "@/hooks/use-translation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  generatePaginationLink?: (page: number, pageSize?: number) => string;
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
  generatePaginationLink,
  onPageSizeChange,
  showPageSizeSelector = true,
  className = "",
}: PaginationProps) {
  const [isChangingPageSize, setIsChangingPageSize] = useState(false);
  const { t } = useTranslation();

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Always include first page
    range.push(1);

    // Add pages around current page
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
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
        rangeWithDots.push("...");
        rangeWithDots.push(uniqueRange[i]);
      } else {
        rangeWithDots.push(uniqueRange[i]);
      }
    }

    return rangeWithDots;
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (!onPageSizeChange) return;

    setIsChangingPageSize(true);
    onPageSizeChange(newPageSize);
    setIsChangingPageSize(false);
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  if (totalPages <= 1 && !showPageSizeSelector) {
    return null;
  }

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}
    >
      {/* Results summary */}
      <div className="text-sm text-gray-600">
        {totalItems > 0 ? (
          <>
            {t('pagination.showing')}{" "}
            <span className="font-medium text-gray-900">{startItem}</span> {t('pagination.to')}{" "}
            <span className="font-medium text-gray-900">{endItem}</span> {t('pagination.of')}{" "}
            <span className="font-medium text-gray-900">{totalItems}</span>{" "}
            {t('pagination.posts')}
          </>
        ) : (
          t('pagination.noPostsFound')
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Page size selector */}
        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">
              {t('pagination.show')}
            </label>
            <CustomSelect
              value={pageSize}
              options={PAGE_SIZE_OPTIONS.map(size => ({ value: size, label: size.toString() }))}
              onChange={handlePageSizeChange}
              disabled={isChangingPageSize}
            />
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <nav
            className="flex items-center gap-1"
            aria-label="Pagination Navigation"
          >
            {/* Previous button */}
            {currentPage <= 1 ? (
              <span className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg opacity-50 cursor-not-allowed">
                {t('pagination.previous')}
              </span>
            ) : generatePaginationLink ? (
              <Link
                href={generatePaginationLink(currentPage - 1)}
                className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200 active:scale-95 transition-all duration-150 cursor-pointer"
                aria-label={t('pagination.goToPreviousPage')}
              >
                {t('pagination.previous')}
              </Link>
            ) : (
              <span className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg opacity-50 cursor-not-allowed">
                {t('pagination.previous')}
              </span>
            )}

            {/* Page numbers */}
            <div className="hidden sm:flex items-center gap-1">
              {getVisiblePages().map((page, index) => (
                <span key={index}>
                  {page === "..." ? (
                    <span className="px-3 py-2 text-sm text-gray-600">...</span>
                  ) : currentPage === page ? (
                    <span
                      className="px-3 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white border border-blue-600 shadow-md"
                      aria-label={`${t('pagination.currentPage')} ${page}`}
                      aria-current="page"
                    >
                      {page}
                    </span>
                  ) : generatePaginationLink ? (
                    <Link
                      href={generatePaginationLink(page as number)}
                      className="px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 cursor-pointer text-gray-600 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm active:bg-gray-200 active:scale-95"
                      aria-label={`${t('pagination.goToPage')} ${page}`}
                    >
                      {page}
                    </Link>
                  ) : (
                    <span className="px-3 py-2 text-sm font-medium rounded-lg text-gray-600 bg-white border border-gray-300 opacity-50 cursor-not-allowed">
                      {page}
                    </span>
                  )}
                </span>
              ))}
            </div>

            {/* Mobile page indicator */}
            <div className="sm:hidden px-3 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg">
              {currentPage} / {totalPages}
            </div>

            {/* Next button */}
            {currentPage >= totalPages ? (
              <span className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg opacity-50 cursor-not-allowed">
                {t('pagination.next')}
              </span>
            ) : generatePaginationLink ? (
              <Link
                href={generatePaginationLink(currentPage + 1)}
                className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200 active:scale-95 transition-all duration-150 cursor-pointer"
                aria-label={t('pagination.goToNextPage')}
              >
                {t('pagination.next')}
              </Link>
            ) : (
              <span className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg opacity-50 cursor-not-allowed">
                {t('pagination.next')}
              </span>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
