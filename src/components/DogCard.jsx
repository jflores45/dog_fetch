import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import './DogCard.css';

const DogList = ({dogs, match}) => {
  const { user } = useAuth();
  
    if (!user) return <p>Please log in first.</p>;
    if (dogs.length === 0) return <p>Loading dogs...</p>;
  
    return (
      <div>
        {dogs.map((dog) => (
          <div 
            key={dog.id} 
            className={`dog-card ${dog.id === match ? 'highlight' : ''}`}
            >
            <h2>{dog.name}</h2>
            <img src={dog.img} alt={dog.name} />
            <p>{dog.breed}</p>
          </div>
        ))}
      </div>
    );
  };

export default DogList;


// fix following bugs: dogs not updating when selcting filter option 
// logout on refresh of page