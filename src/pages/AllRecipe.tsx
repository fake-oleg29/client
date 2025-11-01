import { useState, useEffect } from "react";
import { api } from "../services/api";
import { MoreVertical, X, Star } from "lucide-react";

interface Recipe {
  id: string;
  title: string;
  description: string;
  instructions: string;
  createdAt: string;
  ingredients: Array<{
    ingredient_uuid: string;
    name: string;
    quantity: string;
  }>;
}

interface Review {
  review_uuid: string;
  rating: number;
  user_uuid: string;
}

interface Props {
  userId: string;
}

export default function AllRecipes({ userId }: Props) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>("");
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecipes = async () => {
    try {
      const res = await api.get("recipes", { params: { title: search } });
      setRecipes(res.data.recipes);
    } catch (err) {
      console.error("Error fetching recipes:", err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchUserReview = async (recipeId: string) => {
    setIsLoading(true);
    try {
      const res = await api.get(`comment/${recipeId}`);
      const userReview = res.data.data.find(
        (review: Review) => review.user_uuid === userId
      );

      if (userReview) {
        setExistingReview(userReview);
        setRating(userReview.rating);
      } else {
        setExistingReview(null);
        setRating(5);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setExistingReview(null);
      setRating(5);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = async (recipeId: string) => {
    setSelectedRecipeId(recipeId);
    setIsModalOpen(true);
    await fetchUserReview(recipeId);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecipeId("");
    setRating(5);
    setHoveredStar(0);
    setExistingReview(null);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating < 1 || rating > 5) {
      alert("Rating must be between 1 and 5");
      return;
    }

    try {
      if (existingReview) {
        await api.put("comment", {
          review_uuid: existingReview.review_uuid,
          rating,
        });
        alert("Review updated successfully!");
      } else {
        await api.post("comment", {
          recipe_uuid: selectedRecipeId,
          user_uuid: userId,
          rating,
        });
        alert("Review added successfully!");
      }

      closeModal();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Error saving review");
    }
  };

  const handleDeleteReview = async () => {
    if (!existingReview) return;

    if (!confirm("Are you sure you want to delete your review?")) return;

    try {
      await api.delete(`comment/${existingReview.review_uuid}`);
      alert("Review deleted successfully!");
      closeModal();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Error deleting review");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">All Recipes</h2>

      <div className="flex gap-2 mb-6">
        <input
          className="border border-gray-300 rounded-lg p-3 flex-1 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && fetchRecipes()}
        />
        <button
          onClick={fetchRecipes}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
        >
          Search
        </button>
      </div>

      {recipes.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No recipes found</p>
      ) : (
        <div className="space-y-4">
          {recipes.map((r) => (
            <div
              key={r.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {r.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{r.description}</p>

                  {r.ingredients && r.ingredients.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        Ingredients:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {r.ingredients.slice(0, 3).map((ing) => (
                          <span
                            key={ing.ingredient_uuid}
                            className="text-xs bg-gray-100 px-2 py-1 rounded"
                          >
                            {ing.name} - {ing.quantity}
                          </span>
                        ))}
                        {r.ingredients.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{r.ingredients.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-gray-400">
                    Created: {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={() => openModal(r.id)}
                  className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Add review"
                >
                  <MoreVertical size={20} className="text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              {existingReview ? "Edit Review" : "Add Review"}
            </h3>

            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating *
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          size={32}
                          className={
                            star <= (hoveredStar || rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Selected: {rating} out of 5 stars
                  </p>
                </div>

                <div className="flex gap-2">
                  {existingReview && (
                    <button
                      type="button"
                      onClick={handleDeleteReview}
                      className="flex-1 border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    {existingReview ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
