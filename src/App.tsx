import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import AuthForm from "./components/AuthForm";
import AllRecipes from ".././src/pages/AllRecipe";
import MyRecipes from ".././src/pages/MyRecipe";
import CreateRecipe from ".././src/pages/CreateRecipe";

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUserId = localStorage.getItem("userId");
    if (savedToken) setToken(savedToken);
    if (savedUserId) setUserId(savedUserId);
  }, []);

  const handleAuth = (token: string, userId: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    setToken(token);
    setUserId(userId);
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUserId(null);
  };

  if (!token)
    return <AuthForm onAuth={(token, userId) => handleAuth(token, userId)} />;

  return (
    <Router>
      <nav className="bg-gray-100 p-4 flex gap-4 justify-center">
        <Link to="/" className="text-blue-600">
          All Recipes
        </Link>
        <Link to="/my" className="text-blue-600">
          My Recipes
        </Link>
        <Link to="/create" className="text-blue-600">
          Create Recipe
        </Link>
        <button onClick={handleLogout} className="text-red-500">
          Logout
        </button>
      </nav>

      <Routes>
        <Route path="/" element={<AllRecipes userId={userId!} />} />
        <Route path="/my" element={<MyRecipes userId={userId!} />} />
        <Route path="/create" element={<CreateRecipe userId={userId!} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
