import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import './DogCard.css';

const DogList = ({ dogs, match }) => {
  const { user } = useAuth();
  const { addFavorite, removeFavorite, isFavorited } = useFavorites();

  if (!user) return <p>Please log in first.</p>;
  if (!dogs || dogs.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h3>Loading dogs...</h3>
        <img src="./assets/dog-animation.gif" alt="Loading dogs..." style={{ width: '900px' }} />
        {/* <h3>Loading dogs...</h3> */}
      </div>
    );
  }

  return (
    <div className="dog-list-container">
      {dogs.map((dog) => {
        const favorited = isFavorited(dog.id);

        const handleFavorite = () => {
          favorited ? removeFavorite(dog.id) : addFavorite(dog);
        };

        return (
      <div
        key={dog.id}
          className="dog-card"
        >

          <div className="dog-image-container">
            <img src={dog.img} alt={dog.name} />
            <button className="favorite-btn" onClick={handleFavorite}>
               {favorited ? <FaHeart color="red" /> : <FaRegHeart color="white" />}
            </button>
          </div>
          <h2>{dog.name}</h2>
          <p>Age: {dog.age}</p>
      </div>

        );
      })}
    </div>
  );
};

export default DogList;
