import { useState, useEffect } from "react";
import './FilterBar.css';

function FilterBreed({ breeds, onFilterChange, setClearTrigger, sortField, sortAsc, onToggleSortDirection, setSortAscDirectly }) {
  const [zip, setZip] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('');
  const [ageMin, setAgeMin] = useState(0);
  const [ageMax, setAgeMax] = useState(10);
  // const [sortField, setSortField] = useState("age");
  // const [sortAsc, setSortAsc] = useState(true);
  const [size, setSize] = useState('');
  // const [clearTrigger, setClearTrigger] = useState(false);
  
  const handleFilterChange = () => {
    if (typeof onFilterChange === "function") {
      onFilterChange({
        breeds: selectedBreed ? [selectedBreed] : [],
        zipCodes: zip ? [zip] : [],
        ageMin,
        ageMax,
        sort: `${sortField}:${sortAsc ? "asc" : "desc"}`,
        size: size || undefined,
      });
    } 
  };
  
  useEffect(() => {
    handleFilterChange();
  }, [selectedBreed, zip, ageMin, ageMax, sortAsc, size]);

  const handleClear = (e) => {
    e.preventDefault();

    // Reset local state
    setSelectedBreed('');
    setZip('');
    setAgeMin(0);
    setAgeMax(10);
    setSortAscDirectly(true);
    setSize('');

    // Send reset filter values to parent
    onFilterChange({
      breeds: [],
      zipCodes: [],
      ageMin: 0,
      ageMax: 10,
      sort: 'asc',
      size: 25
    });
     if (typeof setClearTrigger === 'function') {
      setClearTrigger(prev => !prev); // toggles to activate useEffect in FilterLocation
    }
};

  return (
   <div className="filter-form">

      <div className="form-clear">
        <div><h3>Advanced Search</h3></div>
        <div><a href="#" onClick={handleClear}>Clear All</a></div>
      </div>

      <div className="form-control">
        <label htmlFor="breed">Breed:</label>
        <select id="breed" value={selectedBreed} onChange={(e) => setSelectedBreed(e.target.value)}>
          <option value="">Select a breed</option>
          {breeds.map((breed) => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </select>
      </div>

      <div className="form-control">
        <label htmlFor="zip">Zip Code:</label>
        <input
          id="zip"
          name="zipCode"
          placeholder="Zip Code"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
        />
      </div>

      <div className="form-control">
        <label htmlFor="ageMin">Age Min:</label>
        <input
          type="number"
          id="ageMin"
          value={ageMin}
          min={0}
          max={10}
          onChange={(e) => setAgeMin(Number(e.target.value))}
        />
      </div>

      <div className="form-control">
        <label htmlFor="ageMax">Age Max:</label>
        <input
          type="number"
          id="ageMax"
          value={ageMax}
          min={0}
          max={10}
          onChange={(e) => setAgeMax(Number(e.target.value))}
        />
      </div>
      
      {/* <div className="form-control">
        <label>Direction:</label>
        <div className={toggle-switch ${sortAsc ? 'asc' : 'desc'}} onClick={() => setSortAsc(!sortAsc)}>
          <div className="option">ASC</div>
          <div className="option">DESC</div>
          <div className="slider" />
        </div>
      </div> */}
      
     <div className="form-control">
        <label>Direction:</label>
        <div
          className={`toggle-switch ${sortAsc ? 'asc' : 'desc'}`}
          onClick={onToggleSortDirection}
        >
          <div className="option">ASC</div>
          <div className="option">DESC</div>
          <div className="slider" />
        </div>
      </div>



      <div className="form-control">
        <label htmlFor="size">Results per page:</label>
        <select
          id="size"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
        >
          <option value="25">Default (25)</option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>

  );
}

export default FilterBreed;