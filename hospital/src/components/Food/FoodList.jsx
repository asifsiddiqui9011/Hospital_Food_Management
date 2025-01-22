import React, { useState, useEffect } from "react";
import './FoodList.css'
import { useUser } from "../../userContext/userContext";


const FoodList = () => {

  const { url } = useUser();  

  const [foods, setFoods] = useState([]); // State to store food data
  const [editingId, setEditingId] = useState(null); // State to manage editing
  const [editForm, setEditForm] = useState({
    quantity: "",
    mealType: "",
    ingredients: "",
    instructions: "",
  });

  // Fetch food data from the backend
  useEffect(() => {
    const fetchFoodData = async () => {
        try {
          const response = await fetch(`${url}/api/food`); // Adjust URL as needed
          if (!response.ok) {
            throw new Error("Failed to fetch food data");
          }
          const data = await response.json();
          setFoods(data);
        } catch (error) {
          console.error("Error fetching food data:", error);
        }
      };
  
      fetchFoodData();
  }, []);

  // Handle edit button click
  const handleEditClick = (food) => {
    setEditingId(food._id);
    setEditForm({
      quantity: food.quantity,
      mealType: food.mealType,
      ingredients: food.ingredients.join(", "),
      instructions: food.instructions,
    });
  };

  // Handle save after editing
  const handleSave = async (id) => {
    try {
      const updatedFood = {
        ...editForm,
        ingredients: editForm.ingredients.split(",").map((i) => i.trim()),
      };

      const response = await fetch(`${url}/api/food/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify(updatedFood),
      });
      if (response.ok) {
        alert("Food item updated successfully!");
        setFoods((prev) =>
          prev.map((food) =>
            food._id === id ? { ...food, ...updatedFood } : food
          )
        );
        setEditingId(null);
      } else {
        alert("Failed to update food item.");
      }
      
    } catch (error) {
      console.error("Error updating food:", error);
    }
  };

  
  const handleRemove = async (id) => {
    try {
      const response = await fetch(`${url}/api/food/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json", // Ensure the request has the correct headers
          "Authorization": `Bearer ${localStorage.getItem("auth-token")}`, // Pass auth token from local storage
        },
      });
  
      // Check for HTTP errors and parse response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete food item.");
      }
  
      // Success case
      alert("Food item deleted successfully!");
  
      // Update state to remove the deleted item
      setFoods((prev) => prev.filter((food) => food._id !== id));
    } catch (error) {
      console.error("Error deleting food:", error.message || error);
  
      // Show a user-friendly error message
      alert(`Failed to delete food item. Error: ${error.message || error}`);
    }
  };
  

  return (
    <div className="food-list">
    <h2 className="food-list-title">Food List</h2>
    {foods.length === 0 ? (
      <p className="food-list-empty">No food items available.</p>
    ) : (
      <ul className="food-items">
        {foods.map((food) => (
          <li key={food._id} className="food-item">
            {editingId === food._id ? (
              <div className="edit-form">
                <input
                  type="number"
                  name="quantity"
                  value={editForm.quantity}
                  onChange={(e) =>
                    setEditForm({ ...editForm, quantity: e.target.value })
                  }
                  placeholder="Quantity"
                  className="edit-input"
                />
                <select
                  name="mealType"
                  value={editForm.mealType}
                  onChange={(e) =>
                    setEditForm({ ...editForm, mealType: e.target.value })
                  }
                  className="edit-select"
                >
                  <option value="Morning">Morning</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
                <input
                  type="text"
                  name="ingredients"
                  value={editForm.ingredients}
                  onChange={(e) =>
                    setEditForm({ ...editForm, ingredients: e.target.value })
                  }
                  placeholder="Ingredients (comma-separated)"
                  className="edit-input"
                />
                <textarea
                  name="instructions"
                  value={editForm.instructions}
                  onChange={(e) =>
                    setEditForm({ ...editForm, instructions: e.target.value })
                  }
                  placeholder="Instructions"
                  className="edit-textarea"
                />
                <button
                  onClick={() => handleSave(food._id)}
                  className="button-save"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="button-cancel"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <p className="food-item-detail">
                  <strong>Quantity:</strong> {food.quantity}
                </p>
                <p className="food-item-detail">
                  <strong>Meal Type:</strong> {food.mealType}
                </p>
                <p className="food-item-detail">
                  <strong>Ingredients:</strong> {food.ingredients.join(", ")}
                </p>
                <p className="food-item-detail">
                  <strong>Instructions:</strong> {food.instructions}
                </p>
                <button
                  onClick={() => handleEditClick(food)}
                  className="button-edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleRemove(food._id)}
                  className="button-remove"
                >
                  Remove
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    )}
    </div>
  );
};

export default FoodList;
