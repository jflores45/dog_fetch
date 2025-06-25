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
  const [loc, setLoc] = useState([]);
  const [match, setMatch] = useState(null);

  const dogsPerPage = 25;
  const [currentFilters, setCurrentFilters] = useState({});
  const [paginationCursor, setPaginationCursor] = useState(null);

  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalResults / dogsPerPage);

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
  if (filters.sort) {
    params.append("sort", `age:${filters.sort}`);
  }

  params.append("size", dogsPerPage);

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

    const data = await fetchDogDetails(dogIds);
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
  setCurrentFilters(filters);
  setCurrentPage(1); // reset page if we have updated search
  fetchDogs(filters, null);
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

  return (
    <div className="container">
      <Nav/>
      <h1>Hi, Welcome to Fetch's Dog Adoption Search!</h1>

      <div className="result-container">
          <div>
            <h3> Results ({totalResults}) </h3>
          </div>
          <div className='sort-dropdown'>
            <label htmlFor="sort">Sort by: </label>
                <select id="sort" onChange={(e) => handleSortChange(e.target.value)}>
                  <option value="">Select</option>
                  <option value="breed">Breed</option>
                  <option value="name">Name</option>
                  <option value="age">Age</option>
                </select>
          </div>
      </div>

      <div className="main-content">
        
        <div className="filters-buttons">
          <div className="filters">
            <FilterBreed breeds={breeds} onFilterChange={handleFilterChange} />
            <FilterLocation onZipCodes={(zipCodes) => handleFilterChange({ zipCodes })} />
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
        {/* <div>
          Page {currentPage} of {totalPages}
        </div> */}

        <button onClick={handlePrevPage} disabled={!paginationCursor?.prev}>Prev</button>
         Page {currentPage} of {totalPages}
        <button onClick={handleNextPage} disabled={!paginationCursor?.next}>Next</button>
     
      </div>
    </div>
  );
};
  
  export default SearchPage;