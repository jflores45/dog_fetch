import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import './DogCard.css';

const DogList = ({dogs, match}) => {
  const { user } = useAuth();
  
    if (!user) return <p>Please log in first.</p>;
    if (dogs.length === 0) return <p>Loading dogs...</p>;
  
    return (
     <div className="dog-list-container">
        {dogs.map((dog) => (
          <div 
            key={dog.id} 
            className={`dog-card ${dog.id === match ? 'highlight' : ''}`}
            >
            <img src={dog.img} alt={dog.name} />
            <h2>{dog.name}</h2>
            <p>Age: {dog.age}</p>
            
          
          </div>
        ))}
      </div>
    );
  };

export default DogList;
