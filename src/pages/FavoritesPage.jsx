import React from 'react';
import { useEffect, useState } from "react";
import { useFavorites } from "../context/FavoritesContext";
import DogList from "../components/DogCard";

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
    <div>
      <h2>Your Favorite Dogs</h2>
      {/* Render your DogList here */}
      <DogList dogs={favorites} match={null} />
    </div>
  );
}
export default FavoritesPage;