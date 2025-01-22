import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddMealTask.css";
import MealTaskList from "./MealTaskList";
import MealTaskListForPantry from "./MealTaskListForPantry";
import { useUser } from "../../userContext/userContext";

const AddMealTask = () => {

  const { url } = useUser();
  const [foodList, setFoodList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFoodId, setSelectedFoodId] = useState(null);

  // Fetch Food List
  useEffect(() => {
    const fetchFoodList = async () => {
      try {
        const response = await axios.get(`${url}/api/food`);
        setFoodList(response.data);
      } catch (error) {
        console.error("Error fetching food list", error);
      }
    };
    fetchFoodList();
  }, []);

  // Handle Task Assignment
  const handleAssignTask = async () => {
    try {
      if (!selectedFoodId) return alert("Please select a food item to assign!");

      const newTask = {
        foodId: selectedFoodId,
      };

      const response = await axios.post(`${url}/api/meals`, newTask, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("auth-token")}`
        }
      });

      if (response.status === 200) {
        alert("Meal Task Assigned Successfully!");
        setShowModal(false);
        setSelectedFoodId(null);
      } else {
        alert("Failed to assign meal task.");
      }
    } catch (error) {
      console.error("Error assigning meal task", error);
      alert("Failed to assign meal task.");
    }
  };

  return (
    <>
    <div className="meal-task-assigner">
      <h1>Meal Task Assigner</h1>
      <button className="add-task-btn" onClick={() => setShowModal(true)}>
        Add Task
      </button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Select Food for Meal Task</h2>
            <div className="food-list">
              {foodList.map((food) => (
                <div
                  key={food._id}
                  className={`food-item ${
                    selectedFoodId === food._id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedFoodId(food._id)}
                >
                  <p>
                    <strong>Meal Type:</strong> {food.mealType}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {food.quantity}
                  </p>
                  <p>
                    <strong>Ingredients:</strong> {food.ingredients.join(", ")}
                  </p>
                  <p>
                    <strong>Instructions:</strong> {food.instructions}
                  </p>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="assign-btn" onClick={handleAssignTask}>
                Assign Task
              </button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      
    </div>
    
    <MealTaskList/>
    <MealTaskListForPantry/>
  </>
  );
};

export default AddMealTask;
