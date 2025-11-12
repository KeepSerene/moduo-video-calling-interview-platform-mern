import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = "",
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [inputPage, setInputPage] = useState(currentPage.toString());

  // Update input when currentPage changes externally
  useEffect(() => {
    setInputPage(currentPage.toString());
  }, [currentPage]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;

    // only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setInputPage(value);
    }
  };

  const handleInputBlur = () => {
    const pageNum = parseInt(inputPage, 10);

    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
    } else {
      // reset to current page if invalid
      setInputPage(currentPage.toString());
    }
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter") {
      handleInputBlur();
    }
  };

  // Don't render if there's only one page or no items
  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <nav
      aria-label="Pagination Navigation"
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}
    >
      {/* Items info */}
      <div className="text-sm text-base-content/70 order-2 sm:order-1">
        Showing{" "}
        <span className="font-semibold text-base-content">
          {startItem}-{endItem}
        </span>{" "}
        of <span className="font-semibold text-base-content">{totalItems}</span>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2 order-1 sm:order-2">
        {/* Previous button */}
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
          className="btn btn-sm btn-primary btn-outline gap-1"
        >
          <ChevronLeft className="size-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page input */}
        <div className="flex items-center gap-2">
          <label htmlFor="page-input" className="text-sm text-base-content/70">
            Page
          </label>

          <input
            id="page-input"
            type="text"
            inputMode="numeric"
            value={inputPage}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            aria-label="Current page number"
            className="input input-sm input-bordered w-16 text-center focus:input-primary"
          />
          <span className="text-sm text-base-content/70">of {totalPages}</span>
        </div>

        {/* Next button */}
        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
          className="btn btn-sm btn-primary btn-outline gap-1"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-4" />
        </button>
      </div>
    </nav>
  );
}

export default Pagination;
