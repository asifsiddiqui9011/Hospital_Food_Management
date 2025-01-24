

import  { useContext, useEffect, useState } from "react";
import "./MealTaskList.css";
import { UserContext } from "../../context/UserContext";

const MealTaskListForPantry = () => {

  const { url } = useContext(UserContext);
  const [mealTasks, setMealTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "delivery" or "preparation"

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

  // Fetch pantry staff list
  useEffect(() => {
    const fetchStaffList = async () => {
      try {
        const response = await fetch(`${url}/api/pantrystaff`);
        if (!response.ok) {
          throw new Error("Failed to fetch staff list.");
        }
        const data = await response.json();
        setStaffList(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStaffList();
  }, []);

  // Function to handle assigning staff
  const handleAssignStaff = async (taskId, staffId, type) => {
    try {
      const endpoint =
        type === "Delivery"
          ? `${url}/api/meals/${taskId}/assign-delivery-staff`
          : `${url}/api/meals/${taskId}/assign-preparation-staff`;

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("auth-token")}`
        },
        body: JSON.stringify({ staffId }),
      });

      if (!response.ok) {
        alert(response,staffId)
        console.log(response,"responseeee",staffId)
        throw new Error(`Failed to assign ${type} staff.`);
      }

      const updatedTask = await response.json();
      setMealTasks((prevMealTasks) =>
        prevMealTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
      setShowModal(false); // Close the modal after assigning
      alert(`${type} Staff Assigned Successfully`);
    } catch (err) {
      console.error(err);
      alert("Assignment Failed");
    }
  };

  // Function to remove assigned staff
  const handleRemoveStaff = async (taskId, staffId, type) => {
    try {
      const endpoint =
        type === "Delivery"
          ? `${url}/api/meals/${taskId}/remove-delivery-staff`
          : `${url}/api/meals/${taskId}/remove-preparation-staff`;

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("auth-token")}`
        },
        body: JSON.stringify({ staffId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to remove ${type} staff.`);
      }

      const updatedTask = await response.json();
      setMealTasks((prevMealTasks) =>
        prevMealTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
      alert(`${type} Staff Removed Successfully`);
    } catch (err) {
      console.error(err);
      alert("Removal Failed");
    }
  };

  // Function to open the modal
  const openModal = (task, type) => {
    setSelectedTask(task);
    setModalType(type);
    setShowModal(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="meal-task-list-container">
      <h2>Assign Staff To Meal Task</h2>
      {mealTasks.length === 0 ? (
        <p>No meal tasks assigned yet.</p>
      ) : (
        <table className="meal-task-table">
          <thead>
            <tr>
              <th>Food Name & Ingredients</th>
              <th>Quantity</th>
              <th>Meal Type</th>
              <th>Delivery Staff</th>
              <th>Preparation Staff</th>
              <th>Actions</th>
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
                <td>{task.foodId?.mealType}</td>
                <td>
                  <ul>
                    {task.deliveryStaff?.map((staff) => (
                      <li key={staff._id}>
                        {staff.staffName}{" "}
                        <button
                          onClick={() =>
                            handleRemoveStaff(task._id, staff._id, "Delivery")
                          }
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul>
                    {task.preparationStaff?.map((staff) => (
                      <li key={staff._id}>
                        {staff.staffName}{" "}
                        <button
                          onClick={() =>
                            handleRemoveStaff(task._id, staff._id, "Food_Preparation")
                          }
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <button onClick={() => openModal(task, "Delivery")}>
                    Assign Delivery Staff
                  </button>
                  <button onClick={() => openModal(task, "Food_Preparation")}>
                    Assign Preparation Staff
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && selectedTask && (
        <div className="modal">
          <div className="modal-content">
            <h3>
              Assign {modalType === "Delivery" ? "Delivery" : "Food_Preparation"} Staff
            </h3>
            <ul>
              {staffList
                .filter((staff) => staff.role === modalType)
                .map((staff) => (
                  <li key={staff._id}>
                    {staff.staffName}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <button
                      onClick={() =>
                        handleAssignStaff(selectedTask._id, staff._id, modalType)
                      }
                    >
                      Assign
                    </button>
                  </li>
                ))}
            </ul>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealTaskListForPantry;

