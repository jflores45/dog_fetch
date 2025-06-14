import { useState, useEffect } from "react";

function FilterBreed({ breeds, onFilterChange }) {
  const [zip, setZip] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('');
  const [ageMin, setAgeMin] = useState(0);
  const [ageMax, setAgeMax] = useState(10);
  // const [sortField, setSortField] = useState("age");
  const [sortAsc, setSortAsc] = useState(true);
  const [size, setSize] = useState('');

  const handleFilterChange = () => {
    if (typeof onFilterChange === "function") {
      onFilterChange({
        breeds: selectedBreed ? [selectedBreed] : [],
        zipCodes: zip ? [zip] : [],
        ageMin,
        ageMax,
        // sort: `${sortField}:${sortAsc ? 'asc' : 'desc'}`,
        sort: sortAsc ? 'asc' : 'desc',
        size: size || undefined,
      });
    }
  };
  
  useEffect(() => {
    handleFilterChange();
  }, [selectedBreed, zip, ageMin, ageMax, sortAsc, size]);

  return (
    <div>

      <select value={selectedBreed} onChange={(e) => setSelectedBreed(e.target.value)}>
        <option value="">Select a breed</option>
        {breeds.map((breed) => (
          <option key={breed} value={breed}>
            {breed}
          </option>
        ))}
      </select>

      <label htmlFor="zip">Zip Code:</label>
      <input
        id="zip"
        name="zipCode"
        placeholder="Zip Code"
        value={zip}
        onChange={(e) => setZip(e.target.value)}
      />

      <label htmlFor="ageMin">Age Min:</label>
      <input
        type="number"
        id="ageMin"
        value={ageMin}
        min={0}
        max={10}
        onChange={(e) => setAgeMin(Number(e.target.value))}
      />

      <label htmlFor="ageMax">Age Max:</label>
      <input
        type="number"
        id="ageMax"
        value={ageMax}
        min={0}
        max={10}
        onChange={(e) => setAgeMax(Number(e.target.value))}
      />

      
      {/* <label htmlFor="sortField">Sort By:</label>
      <select
        id="sortField"
        value={sortField}
        onChange={(e) => setSortField(e.target.value)}
      >
        <option value="age">Age</option>
        <option value="breed">Breed</option>
        <option value="name">Name</option>
      </select> */}

      <label>Direction:</label>
      <button
        type="button"
        onClick={() => setSortAsc(!sortAsc)}
      >
        {sortAsc ? 'Ascending ↑' : 'Descending ↓'}
      </button>
      

      <label htmlFor="size">Results per page:</label>
      <select
        id="size"
        value={size}
        onChange={(e) => setSize(e.target.value)}
      >
        <option value="">Default (25)</option>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
{/* 
      <label>Sort by Age:</label>
      <button
        type="button"
        onClick={() => setSortAsc(!sortAsc)}
      >
        {sortAsc ? 'Ascending ↑' : 'Descending ↓'}
      </button> */}

      {/* <button type="button" onClick={handleFilterChange}>
        Search
      </button> */}
    </div>
  );
}

export default FilterBreed;
