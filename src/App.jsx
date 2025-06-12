import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import LoginForm from "./pages/LoginPage";
import SearchPage from "./pages/SearchPage";

function App() {
  return (
    <Router>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </AuthProvider>
  </Router>
  );
}

export default App;