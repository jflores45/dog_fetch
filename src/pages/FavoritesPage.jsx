import React from 'react';
import { useEffect, useState } from "react";
import { useFavorites } from "../context/FavoritesContext";
import DogList from "../components/DogCard";
import './FavoritesPage.css';

const FavoritesPage = () => {
  const { favorites } = useFavorites();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favoriteDogs")) || [];
    if (!stored.length) return;

    fetch("/dogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(stored),
    })
      .then((res) => res.json())
      .then(setFavoriteDogs)
      .catch(console.error);
  }, []);

  return (
    <div className='favorite-content'>
      <div className='title'>
        <h1>Your Favorite Dogs:</h1>
      </div>

      <div className='favs'>
          {/* Render your DogList here */}
          <DogList dogs={favorites} match={null} />
      </div>
    
    </div>
  );
}
export default FavoritesPage;