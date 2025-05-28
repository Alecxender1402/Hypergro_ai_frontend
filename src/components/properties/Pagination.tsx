import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  return (
    <nav className="pagination-container flex justify-center mt-8">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="px-2 py-1 mx-1 border rounded disabled:opacity-50"
      >
        First
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 py-1 mx-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>
      {pageNumbers.slice(
        Math.max(0, currentPage - 3),
        Math.min(totalPages, currentPage + 2)
      ).map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-2 py-1 mx-1 border rounded ${currentPage === number ? 'bg-primary text-white' : ''}`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 mx-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 mx-1 border rounded disabled:opacity-50"
      >
        Last
      </button>
    </nav>
  );
};

export default Pagination;
