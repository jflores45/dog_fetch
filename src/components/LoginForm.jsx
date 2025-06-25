import { useState, useEffect } from "react";
import { login as apiLogin } from "../services/api"; // assume this sends the request to your backend
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import './LoginForm.css';

function LoginForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  const { login, user } = useAuth(); // from AuthContext
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/search");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {  
    e.preventDefault();
    setError(null);
    try {
      await apiLogin({ name, email });
      login({ name, email });
     
    } catch (err) {
      setError("Login failed. Please check your info.");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        type="email"         
      />
      <button type="submit">Log In</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default LoginForm;
