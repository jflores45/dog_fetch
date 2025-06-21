import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaHeart } from 'react-icons/fa';


function Nav(){
    const { user } = useAuth();
    const [favorite, setFavorite] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        const stored = localStorage.getItem("favoriteDogs");
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
    }, []);

    const handleFavoriteClick = () => {
        navigate("/favorites"); // assumes you have a /favorites route/page
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
        <nav style={{ display: "flex", justifyContent: "space-between", padding: "1rem" }}>
            <img src="../assets/fetch_logo.png" alt="Fetch Logo" style={{ height: 100 }} />
            <div>
                <button onClick={handleFavoriteClick}>
                  ❤️ ({favorite.length})
                </button>

                <button onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
    
}

export default Nav;