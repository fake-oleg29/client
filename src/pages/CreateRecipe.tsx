import { useState } from "react";

import { api } from "../services/api";

interface Props {
  userId: string;
}

interface Ingredient {
  name: string;
  quantity: string;
}

export default function CreateRecipe({ userId }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", quantity: "" },
  ]);
  const [instructions, setInstructions] = useState("");

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  };

  const handleRemoveIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const handleIngredientChange = (
    index: number,
    field: "name" | "quantity",
    value: string
  ) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валідація
    if (!title.trim()) {
      alert("Будь ласка, введіть назву рецепту");
      return;
    }

    if (!instructions.trim()) {
      alert("Будь ласка, введіть інструкції");
      return;
    }

    // Фільтруємо порожні інгредієнти
    const validIngredients = ingredients.filter(
      (ing) => ing.name.trim() && ing.quantity.trim()
    );

    if (validIngredients.length === 0) {
      alert("Додайте хоча б один інгредієнт");
      return;
    }

    try {
      await api.post("recipes", {
        title: title.trim(),
        description: description.trim() || undefined,
        instructions: instructions.trim(),
        ingredients: validIngredients,
        user_uuid: userId,
      });

      alert("Рецепт успішно створено!");

      // Очищаємо форму
      setTitle("");
      setDescription("");
      setInstructions("");
      setIngredients([{ name: "", quantity: "" }]);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Помилка при створенні рецепту");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Create recipe</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Ingredient *
            </label>
            <button
              type="button"
              onClick={handleAddIngredient}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Add ingredient
            </button>
          </div>

          <div className="space-y-2">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 items-start">
                <input
                  className="border border-gray-300 rounded-lg p-3 flex-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Name"
                  value={ingredient.name}
                  onChange={(e) =>
                    handleIngredientChange(index, "name", e.target.value)
                  }
                />
                <input
                  className="border border-gray-300 rounded-lg p-3 w-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Quantity"
                  value={ingredient.quantity}
                  onChange={(e) =>
                    handleIngredientChange(index, "quantity", e.target.value)
                  }
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    className="p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instruction *
          </label>
          <textarea
            className="border border-gray-300 rounded-lg p-3 w-full h-40 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 w-full rounded-lg transition-colors"
        >
          Create recipe
        </button>
      </form>
    </div>
  );
}
