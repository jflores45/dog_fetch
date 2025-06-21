import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import './DogCard.css';

const DogList = ({ dogs, match }) => {
  const { user } = useAuth();
  const { addFavorite, removeFavorite, isFavorited } = useFavorites();

  if (!user) return <p>Please log in first.</p>;
  if (!dogs || dogs.length === 0) return <p>Loading dogs...</p>;

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
            className={`dog-card ${dog.id === match ? 'highlight' : ''}`}
          >
            <img src={dog.img} alt={dog.name} />
            <h2>{dog.name}</h2>
            <p>Age: {dog.age}</p>

            <button onClick={handleFavorite}>
              {favorited ? "💔 Unfavorite" : "❤️ Favorite"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default DogList;
