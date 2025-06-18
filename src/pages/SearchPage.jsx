import { useState, useEffect } from 'react';
import DogList from '../components/DogCard';
import FilterBreed from '../components/FilterBar';
import FilterLocation from '../components/LocationBar';
import { useAuth } from '../context/AuthContext';
import './SearchPage.css';
// const BASE_URL = "https://frontend-take-home-service.fetch.com";

const SearchPage = () => {
  const { user } = useAuth();
  const [breeds, setBreeds] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [loc, setLoc] = useState([]);
  const [match, setMatch] = useState(null);
  

  useEffect(() => {
    console.log("SearchPage mounted. User:", user);
    if (!user) return; // don't fetch unless logged in
   
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


const buildQuery = (filters) =>{
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

  if (filters.size) {
    params.append("size", filters.size);
  }

  return params.toString();

};

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

const fetchDogs = async (filters) => {
  try {
    const query = buildQuery(filters);
    const res = await fetch(`/dogs/search?${query}`, {
      method: 'GET',
      credentials: 'include',
    });
    console.log("Built query string:", query);

    const searchData = await res.json();
    const dogIds = searchData.resultIds;

    if(!dogIds.length){
      setDogs([]);
      return;
    }
    const data = await fetchDogDetails(dogIds);
    setDogs(data);
    console.log("Filtered dog results:", data);
  
  } catch (error) {
    console.error("Error fetching dogs with filters:", error);
  }
};

const handleFilterChange = (filters) => {
  fetchDogs(filters);
};

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

const Logout = async() =>{
  try{
    if (!user) return;
  }
  catch(error){
    console.error('Error matching dog:', error);
    return null;
  }
};
// const findMatch = () => {
//   dogMatch();
// };
  return (
    <div className="container">
      <h1>Hi, Welcome to the Search Page!</h1>

      <div className="main-content">
        <div className="filters-buttons">
          <div className="filters">
            <FilterBreed breeds={breeds} onFilterChange={handleFilterChange} />
            <FilterLocation onZipCodes={(zipCodes) => handleFilterChange({ zipCodes })} />
          </div>

          <div className="buttons">
            <button onClick={dogMatch}>Find My Match</button>
            <button onClick={Logout}>Logout</button>
          </div>
        </div>

        <div className="matches">
          <DogList dogs={dogs} match={match} />
        </div>
      </div>

      <div className="pagination">
        <button onClick={Logout}>Prev</button>
        <button onClick={Logout}>Next</button>
      </div>
    </div>
  );
};
  
  export default SearchPage;