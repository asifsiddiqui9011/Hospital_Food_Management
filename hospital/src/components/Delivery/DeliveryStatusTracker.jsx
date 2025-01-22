import React, { useEffect, useState } from "react";
import "./DeliveryStatusUpdater";
import { useUser } from "../../userContext/userContext";

const DeliveryStatusTracker = () => {
  const [mealTasks, setMealTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortKey, setSortKey] = useState("deliveryStatus"); // Default sort key
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  

  const { url } = useUser();
  // Fetch meal tasks with delivery statuses
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

  // Update delivery status to "Out for Delivery" for a task
  const markAllOutForDelivery = async (mealTaskId) => {
    try {
      const response = await fetch(
        `${url}/api/meals/${mealTaskId}/mark-out-for-delivery`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update delivery statuses.");
      }

      const updatedMealTask = await response.json();
      setMealTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedMealTask._id ? updatedMealTask : task
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Sorting logic
  const getSortedMealTasks = () => {
    const sortedTasks = [...mealTasks].sort((a, b) => {
      if (sortKey === "deliveryStatus") {
        const statusPriority = {
          Pending: 1,
          "Out for Delivery": 2,
          Delivered: 3,
          Failed: 4,
        };

        const aStatus = Math.min(
          ...a.deliveryStatuses.map((status) => statusPriority[status.status] || 0)
        );
        const bStatus = Math.min(
          ...b.deliveryStatuses.map((status) => statusPriority[status.status] || 0)
        );
        return aStatus - bStatus;
      }
      return 0; // Default sorting
    });

    return sortedTasks;
  };

  const sortedMealTasks = getSortedMealTasks();

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="delivery-status-tracker-container">
      <h2>Delivery Status Tracker for Pantry Manager</h2>

      {/* Sort by dropdown */}
      <div className="sort-container">
        <label htmlFor="sortKey">Sort By: </label>
        <select
          id="sortKey"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
        >
          <option value="deliveryStatus">Delivery Status</option>
        </select>
      </div>

      {mealTasks.length === 0 ? (
        <p>No meal tasks assigned yet.</p>
      ) : (
        <table className="meal-task-table">
          <thead>
            <tr>
              <th>Food Name</th>
              <th>Meal Type</th>
              <th>Delivery Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedMealTasks.map((task) => (
              <tr key={task._id}>
                <td>{task.foodId?.instructions || "N/A"}</td>
                <td>{task.foodId?.mealType || "N/A"}</td>
                <td>
                  {task.deliveryStatuses.map((status) => (
                    <div key={status._id}>
                      {status.patientId?.patientName || "N/A"}:{" "}
                      <strong>{status.status}</strong>
                    </div>
                  ))}
                </td>
                <td>
                  <button
                    onClick={() => markAllOutForDelivery(task._id)}
                    disabled={task.deliveryStatuses.every(
                      (status) => status.status !== "Pending"
                    )}
                  >
                    Mark All Out for Delivery
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setShowModal(true);
                    }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for showing patient details */}
      {showModal && selectedTask && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Delivery Status Details for {selectedTask.foodId?.instructions}</h3>
            <table>
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Floor</th>
                  <th>Room Number</th>
                  <th>Bed Number</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedTask.deliveryStatuses.map((status) => (
                  <tr key={status._id}>
                    <td>{status.patientId?.patientName || "N/A"}</td>
                    <td>{status.patientId?.floorNumber || "N/A"}</td>
                    <td>{status.patientId?.roomNumber || "N/A"}</td>
                    <td>{status.patientId?.bedNumber || "N/A"}</td>
                    <td>{status.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => {
                setShowModal(false);
                setSelectedTask(null);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryStatusTracker;
