import { useState, useEffect } from 'react';
import Nav from '../components/Navbar';
import DogList from '../components/DogCard';
import FilterBreed from '../components/FilterBar';
import FilterLocation from '../components/LocationBar';
import { useAuth } from '../context/AuthContext';
import './SearchPage.css';

const SearchPage = () => {
  const { user } = useAuth();
  const [breeds, setBreeds] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [locationZips, setLocationZips] = useState([]);
  const [sortField, setSortField] = useState("age");
  const [sortAsc, setSortAsc] = useState(true); 

  const [match, setMatch] = useState(null);
  const [showMatch, setShowMatch] = useState(false);
  const [clearTrigger, setClearTrigger] = useState(false);

  const dogsPerPage = 25;
  const [currentFilters, setCurrentFilters] = useState({});
  const [paginationCursor, setPaginationCursor] = useState(null);

  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const sizeForPageCount = currentFilters.size || dogsPerPage;
  const totalPages = Math.ceil(totalResults / sizeForPageCount);
  useEffect(() => {
    console.log("SearchPage mounted. User:", user);
    if (!user) return; // don't fetch unless logged in
   
    // fetch breed options from database
    const fetchBreeds = async () => {
      try {
        // Step 1: Get dog IDs
        const res = await fetch("/dogs/breeds", {
          method: 'GET',
          credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();

      console.log('HERE ARE Breeds:', data); 
      setBreeds(data);

      } catch (err) {
        console.error('Error fetching dogs:', err);
      }
    };
    fetchBreeds();
}, [user]);

// build query for dog search 
const buildQuery = (filters, cursor = null) => {
  const params = new URLSearchParams();

  if (filters.breeds?.length) {
    filters.breeds.forEach(breed => params.append("breeds", breed));
  }
  if (filters.zipCodes?.length) {
    filters.zipCodes.forEach(zip => params.append("zipCodes", zip));
  }
  if (filters.ageMin !== undefined) {
    params.append("ageMin", filters.ageMin);
  }
  if (filters.ageMax !== undefined) {
    params.append("ageMax", filters.ageMax);
  }
  if (filters.sortField && filters.sortAsc !== undefined) {
    params.append("sort", `${filters.sortField}:${filters.sortAsc ? "asc" : "desc"}`);
  }

  params.append("size", filters.size || dogsPerPage);

  if (cursor) {
    params.append("from", cursor);
  }

  return params.toString();
};
// Dog objects
const fetchDogDetails = async (dogIds) => {
  const res = await fetch('/dogs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(dogIds)
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch dog details: ${res.status}`);
  }

  const dogData = await res.json();
  return dogData;
};

// fetch dogs based on user query
const fetchDogs = async (filters, cursor = null) => {
  try {
    const query = buildQuery(filters, cursor);
    const res = await fetch(`/dogs/search?${query}`, {
      method: 'GET',
      credentials: 'include',
    });
    console.log("Built query string:", query);
    
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const searchData = await res.json();
    const dogIds = searchData.resultIds;

    setTotalResults(searchData.total);

    if (!dogIds.length) {
      setDogs([]);
      setPaginationCursor(null);
      return;
    }
    // console.log("return object:", data);
    const data = await fetchDogDetails(dogIds);
    console.log("🐶 Dog results:", data);
    setDogs(data);

    // Save next and prev cursors
    setPaginationCursor({
      next: searchData.next || null,
      prev: searchData.prev || null
    });

  } catch (error) {
    console.error("Error fetching dogs with filters:", error);
  }
};

// handle filter changes
const handleFilterChange = (filters) => {
  const updatedFilters = {
    ...filters,
    sortField, // use current dropdown value
    sort: `${sortField}:${filters.sortAsc ? 'asc' : 'desc'}` // construct proper string
  };

  setCurrentFilters(updatedFilters);
  setCurrentPage(1);
  fetchDogs(updatedFilters, null);
};


// find users dog match
const dogMatch = async() => {
  try {
    if (!dogs.length) return;

    const res = await fetch('/dogs/match', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(dogs.map((dog) => dog.id)),
      credentials: 'include',
    });
  
    if(!res.ok){
      throw new Error(`Failed to match dog: ${res.statusText}`);
    }
    const { match } = await res.json();
    setMatch(match);
    setShowMatch(true);
    console.log('Matched dog ID:', match); 
  } 
  catch(error){
    console.error('Error matching dog:', error);
    return null;
  }
};

// handle page updates
const handleNextPage = () => {
    if (!paginationCursor?.next || currentPage >= totalPages) return;
    const urlParams = new URLSearchParams(paginationCursor.next);
    const cursor = urlParams.get('from');
    fetchDogs(currentFilters, cursor);
    setCurrentPage(prev => prev + 1); 
};

const handlePrevPage = () => {
    if (!paginationCursor?.prev || currentPage <= 1) return;
    const urlParams = new URLSearchParams(paginationCursor.prev);
    const cursor = urlParams.get('from');
    fetchDogs(currentFilters, cursor);
    setCurrentPage(prev => Math.max(prev - 1, 1));
};


useEffect(() => {
  setCurrentFilters(prevFilters => {
    const updatedFilters = {
      ...prevFilters,
      zipCodes: locationZips.length > 0 ? locationZips : [],
    };
    setCurrentPage(1);
    fetchDogs(updatedFilters, null);
    return updatedFilters;
  });
}, [locationZips]);


const handleSortChange = (field) => {
  setSortField(field);

  const updatedFilters = {
    ...currentFilters,
    sortField: field,
    sortAsc, // use current direction
  };

  setCurrentFilters(updatedFilters);
  setCurrentPage(1);
  fetchDogs(updatedFilters, null);
};


  return (
    <div className="container">
      <Nav/>
      <h1>Hi, Welcome to Fetch's Dog Adoption Search!</h1>


      <div className="result-container">
          <div className='results'>
            <p> Results ({totalResults}) </p>
          </div>
          <div className='sort-dropdown'>
            
            <label htmlFor="sort">Sort by: </label>
                {/* <select id="sort" onChange={(e) => handleSortChange(e.target.value)}> */}
                 <select onChange={(e) => handleSortChange(e.target.value)} value={sortField}>
                  <option value="age">Age</option>
                  <option value="breed">Breed</option>
                  <option value="name">Name</option>
                </select>
          </div>
      </div>

      {showMatch && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowMatch(false)}>✖</button>
            <h2>Your Best Match!</h2>
            {dogs.filter(dog => dog.id === match).map(dog => (
              <div key={dog.id} className="match-card">
                <img src={dog.img} alt={dog.name} />
                <h3>{dog.name}</h3>
                <p>Age: {dog.age}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="main-content">
        
        <div className="filters-buttons">
            <div className="filters">
              <FilterBreed breeds={breeds} onFilterChange={handleFilterChange}
                setClearTrigger={setClearTrigger} currentFilters={currentFilters}
              />

            <FilterLocation
                onZipCodes={setLocationZips}
                clearTrigger={clearTrigger}
              />
            </div>

            <div className="match-btn">
              <button onClick={dogMatch}>Find My Match</button>
            </div>

        </div>

        <div className="filter-dogs">
            <DogList dogs={dogs} match={match} />
        </div>
      </div>

      <div className="pagination">
        <button onClick={handlePrevPage} disabled={!paginationCursor?.prev}>&lt;</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={!paginationCursor?.next}>&gt;</button>
      </div>
    </div>
  );
};
  
  export default SearchPage;