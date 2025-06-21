import React, { createContext, useContext, useState } from "react";

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (dog) => {
    if (!favorites.find((f) => f.id === dog.id)) {
      setFavorites((prev) => [...prev, dog]);
    }
  };

  const removeFavorite = (dogId) => {
    setFavorites((prev) => prev.filter((dog) => dog.id !== dogId));
  };

  const isFavorited = (dogId) => favorites.some((dog) => dog.id === dogId);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorited }}>
      {children}
    </FavoritesContext.Provider>
  );
};
