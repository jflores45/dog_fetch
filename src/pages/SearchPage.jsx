import { useState, useEffect } from 'react';
import DogList from '../components/DogCard';
import FilterBreed from '../components/FilterBar';
import { useAuth } from '../context/AuthContext';

// const BASE_URL = "https://frontend-take-home-service.fetch.com";

const SearchPage = () => {
  const { user } = useAuth();
  const [breeds, setBreeds] = useState([]);
  const [dogs, setDogs] = useState([]);
  
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
    const res = await fetch("/dogs/search?${query}", {
      method: 'GET',
      credentials: 'include',
    });


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

  return (
    <div>
      <h1>Hi, Welcome to the Search Page!</h1>
     
      <FilterBreed breeds={breeds} onFilterChange={handleFilterChange}/>
      <DogList dogs={dogs} />
    </div>
  );
};
  
  export default SearchPage;