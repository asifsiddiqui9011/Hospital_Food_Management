
import { useUser } from "../../userContext/userContext";
import  { useEffect, useState } from "react";
import "./MealTaskList.css";

const MealTaskForPreparationUpdate = () => {

  const { url,user } = useUser();
  const [mealTasks, setMealTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch meal tasks from the backend
  const fetchMealTasks = async () => {
    try {
      // Retrieve the token from local storage
      const token = localStorage.getItem("auth-token");

      // Determine the URL based on the user's role
      const userRole = user.role;
      const apiUrl = userRole === "manager" 
        ? `${url}/api/meals`
        : `${url}/api/mealsToPreparationStaff`;

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token here
        },
      });
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
  useEffect(() => {
   

    fetchMealTasks();
  }, []);

  // Function to handle preparation status change
  const handleStatusChange = async (mealTaskId, newStatus) => {
    try {
      // Retrieve the token from local storage
      const token = localStorage.getItem("auth-token");
  
      const response = await fetch(
        `${url}/api/meals/${mealTaskId}/preparation-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Pass the token here
          },
          body: JSON.stringify({ preparationStatus: newStatus }),
        }
      );
  
      if (!response.ok) {
        console.log(response, "response assigning task");
        throw new Error("Failed to update preparation status.");
      }
  
      const updatedMealTask = await response.json();
      setMealTasks((prevMealTasks) =>
        prevMealTasks.map((task) =>
          task._id === updatedMealTask._id
            ? updatedMealTask
            : task
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };
  

  console.log(mealTasks,"mealtask")

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="meal-task-list-container">
      <h2>Assigned Meal Tasks (Pantry Food Preparation Staff)</h2>
      {mealTasks.length === 0 ? (
        <p>No meal tasks assigned yet.</p>
      ) : (
        <table className="meal-task-table">
          <thead>
            <tr>
              <th>Food Name & Ingredients</th>
              <th>Quantity</th>
              <th>Meal Type</th>
              <th>Preparation Staff</th>
              <th>Preparation Status</th>
            </tr>
          </thead>
          <tbody>
            {mealTasks.map((task) => (
              <tr key={task._id}>
                <td>
                  <strong>{task.foodId?.instructions || "N/A"}</strong>
                  <ul>
                    {task.foodId?.ingredients?.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </td>
                <td>{task?.quantity || 0}</td>
                <td>{task.foodId?.mealType || "N/A"}</td>
                <td>
                  {task.preparationStaff?.map((staff, index) => (
                    <div key={index}>{staff.staffName || "N/A"}</div>
                  ))}
                </td>
                <td>
                  <select
                    value={task.preparationStatus}
                    onChange={(e) =>
                      handleStatusChange(task._id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Prepared">Prepared</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MealTaskForPreparationUpdate;
