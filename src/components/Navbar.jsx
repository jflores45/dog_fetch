import { useEffect,  useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import "./Navbar.css"; 

function Nav(){
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { favorites } = useFavorites();

    const handleFavoriteClick = () => {
        navigate("/favorites");
    };
    
    const handleLogout = async () => {
        const res = await fetch("/auth/logout", {
          method: "POST",
          credentials: "include",
        });

        if (res.ok) {
          logout();
          navigate("/");
        } else {
          console.error("Logout failed:", res.status);
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