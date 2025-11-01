import { useEffect, useState } from "react";
import { api } from "../services/api";

interface Props {
  userId: string;
}

export default function MyRecipes({ userId }: Props) {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  console.log(userId);
  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const res = await api.get(`recipes/${userId}`);
        setRecipes(res.data.recipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyRecipes();
  }, [userId]);

  if (recipes.length === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <h2 className="text-2xl mb-4">You not have own recipes</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <h2 className="text-xl text-gray-500">Loading your recipes...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl mb-4">My Recipes</h2>
      {recipes.map((r) => (
        <div key={r.recipe_uuid} className="border p-4 mb-2 rounded">
          <h3 className="font-bold">{r.title}</h3>
          <p>{r.description}</p>
        </div>
      ))}
    </div>
  );
}
