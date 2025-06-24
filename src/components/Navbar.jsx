import { useEffect,  useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { FaHeart } from 'react-icons/fa';
import "./Navbar.css"; 

function Nav(){
    const { user } = useAuth();
    const navigate = useNavigate();
    const { favorites } = useFavorites();

    const handleFavoriteClick = () => {
        navigate("/favorites");
    };
    
    const handleLogout = async () => {
        try { 
          await fetch("/auth/logout", {
            method: "POST",
            credentials: "include",
          });

          navigate("/");
        } catch (error) {
          console.error("Error logging out:", error);
        }
    };

    return (
        <nav className="nav">
            <img src="../assets/fetch_logo.png" alt="Fetch Logo" style={{ height: 100 }} />
            <div>
                <button  className="favorite-button" onClick={handleFavoriteClick}>
                  ❤️ ({favorites.length})
                </button>

                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
    
}

export default Nav;