import React, { useState, useEffect } from 'react';

const SearchFilter = ({ onSearch ,searchQuery ,setSearchQuery}) => {

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      onSearch(searchQuery);
    }, 500);

    return () => clearTimeout(debounceTimeout); // Cleanup timeout on component unmount or query change
  }, [searchQuery, onSearch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search Cameras"
      value={searchQuery}
      onChange={handleSearchChange}
      style={{ width: '300px', padding: '8px', marginBottom: '10px' }}
    />
  );
};

export default SearchFilter;