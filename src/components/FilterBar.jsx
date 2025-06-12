import { useState, useEffect } from "react";

function FilterBreed({ breeds, onFilterChange }) {
  const [zip, setZip] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('');
  const [ageMin, setAgeMin] = useState(0);
  const [ageMax, setAgeMax] = useState(10);
  const [sortAsc, setSortAsc] = useState(true);
  const [size, setSize] = useState('');

  const handleFilterChange = () => {
    if (typeof onFilterChange === "function") {
      onFilterChange({
        breeds: selectedBreed ? [selectedBreed] : [],
        zipCodes: zip ? [zip] : [],
        ageMin,
        ageMax,
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

      <label htmlFor="size">Size:</label>
      <select
        id="size"
        value={size}
        onChange={(e) => setSize(e.target.value)}
      >
        <option value="">Any Size</option>
        <option value="Small">Small</option>
        <option value="Medium">Medium</option>
        <option value="Large">Large</option>
        <option value="XLarge">XLarge</option>
      </select>

      <label>Sort by Age:</label>
      <button
        type="button"
        onClick={() => setSortAsc(!sortAsc)}
      >
        {sortAsc ? 'Ascending ↑' : 'Descending ↓'}
      </button>

    </div>
  );
}

export default FilterBreed;
