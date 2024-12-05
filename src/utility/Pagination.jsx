import React from "react";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    // alert(totalPages)
    if (pageNumber > 0 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  return (
    <div className="df gap-10">
      <div>
        <select
          className="selectPage"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div>
      <div>
        {/* {`Showing ${((currentPage - 1) * itemsPerPage) + 1} to ${Math.min(
          currentPage * itemsPerPage,
          totalItems
        )} of ${totalItems} items`} */}
        {(currentPage - 1) * itemsPerPage + 1} -
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
      </div>

      <div className="paginationButton">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(1)}
        >
          <MdKeyboardDoubleArrowLeft/>
        </button>
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <MdKeyboardArrowLeft/>
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <MdKeyboardArrowRight/>
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
         <MdKeyboardDoubleArrowRight/>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
