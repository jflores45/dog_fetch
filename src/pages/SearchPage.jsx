import { useState, useEffect } from 'react';
import DogList from '../components/DogCard';
import FilterBreed from '../components/FilterBar';
import { useAuth } from '../context/AuthContext';

// const BASE_URL = "https://frontend-take-home-service.fetch.com";

const SearchPage = () => {
  const { user } = useAuth();
  const [breeds, setBreeds] = useState([]);
  // const [dogs, setDogs] = useState([]);

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

const fetchDogs = async (filters) => {
  try {
    const res = await fetch("/dogs/search", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(filters),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log("Filtered dog results:", data);
    setDogs(data);
    // You might want to save this in state and render <DogList dogs={data} />
  } catch (error) {
    console.error("Error fetching dogs with filters:", error);
  }
};

const handleFilterChange = (filters) => {
  fetchDogs(filters);
};

  return (
    <div>
      <h1>Hi, Welcome to the Search Page!</h1>
      {/* <DogList dogs={dogs} /> */}
      <FilterBreed breeds={breeds} onFilterChange={handleFilterChange}/>
      {/* <FilterBreed breeds={breeds} /> */}
    </div>
  );
};
  
  export default SearchPage;