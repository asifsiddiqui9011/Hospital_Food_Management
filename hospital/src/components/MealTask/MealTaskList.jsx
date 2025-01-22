

import React, { useEffect, useState } from "react";
import "./MealTaskList.css";
import { useUser } from "../../userContext/userContext";

const MealTaskList = () => {

  const { url } = useUser();
  const [mealTasks, setMealTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch meal tasks from the backend
  useEffect(() => {
    const fetchMealTasks = async () => {
      try {
        const response = await fetch(`${url}/api/meals`);
        if (!response.ok) {
          throw new Error("Failed to fetch meal tasks.");
        }
        const data = await response.json();
        setMealTasks(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMealTasks();
  }, []);

  // Handle task removal
  const handleRemove = async (taskId) => {
    if (window.confirm("Are you sure you want to remove this task?")) {
      try {
        const response = await fetch(`${url}/api/meals/${taskId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("auth-token")}`
          },
        });
        if (!response.ok) {
          throw new Error("Failed to remove the task.");
        }
        setMealTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="meal-task-list-container">
      <h2>Assigned Meal Tasks</h2>
      {mealTasks.length === 0 ? (
        <p>No meal tasks assigned yet.</p>
      ) : (
        <table className="meal-task-table">
          <thead>
            <tr>
              <th>Food Name</th>
              <th>Meal Type</th>
              <th>Preparation Status</th>
              <th>Delivery Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mealTasks.map((task) => (
              <tr key={task._id}>
                <td>{task.foodId?.instructions || "N/A"}</td>
                <td>{task.foodId?.mealType}</td>
                <td>{task.preparationStatus}</td>
                <td>
                  {task.deliveryStatuses.length > 0 ? (
                    task.deliveryStatuses.map((status, index) => (
                      <div key={index} className="delivery-status">
                        <strong>Patient:</strong> {status.patientId?.patientName || "N/A"}<br />
                        <strong>Status:</strong> {status.status}
                      </div>
                    ))
                  ) : (
                    <span>No delivery statuses</span>
                  )}
                </td>
                <td>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(task._id)}
                  >
                    Remove
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
          
        </table>
       
      )}
    </div>
  );
};

export default MealTaskList;
