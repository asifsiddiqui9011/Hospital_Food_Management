


import React, { useEffect, useState } from "react";
import "./DeliveryStatusUpdater.css";
import { useUser } from "../../userContext/userContext";

const DeliveryStatusUpdater = () => {
  const [mealTasks, setMealTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortKey, setSortKey] = useState("floor"); // Default sort key

  const { url } = useUser();
  // Fetch meal tasks with delivery statuses
  const fetchMealTasks = async () => {
    try {
      // Retrieve the auth token from localStorage
      const token = localStorage.getItem("auth-token");
  
      if (!token) {
        throw new Error("Authentication token not found.");
      }
  
      // Make the fetch request with the Authorization header
      const response = await fetch(`${url}/api/mealss`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token
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
  
  // Call the function in the useEffect
  useEffect(() => {
    fetchMealTasks();
  }, []);
  
  useEffect(() => {

    fetchMealTasks();
  }, []);

 

  const updateDeliveryStatus = async (mealTaskId, patientId, newStatus) => {
    try {
      const response = await fetch(
        `${url}/api/meals/${mealTaskId}/update-delivery-status/${patientId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
  
      if (!response.ok) {
        console.error("Failed to update delivery status:", { mealTaskId, patientId, newStatus });
        throw new Error("Failed to update delivery status.");
      }
  
      const updatedMealTask = await response.json();
      console.log("Updated Meal Task:", updatedMealTask);
  
      if (!updatedMealTask || !updatedMealTask.updatedMealTask) {
        throw new Error("Invalid response format.");
      }
    setMealTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedMealTask.updatedMealTask._id
          ? {
              ...task,
              deliveryStatuses: task.deliveryStatuses.map((status) =>
                status.patientId._id === patientId
                  ? { ...status, status: newStatus }
                  : status
              ),
            }
          : task
      )
    );
      
    } catch (err) {
      console.error("Error in updateDeliveryStatus:", err);
      setError(err.message);
    }
  };
  

  // Sorting logic
  const getSortedMealTasks = () => {
    const sortedTasks = [...mealTasks]
      .map((task) => {
        // Sort the deliveryStatuses array within each mealTask
        const sortedStatuses = [...task.deliveryStatuses].sort((a, b) => {
          if (sortKey === "floor") {
            const floorA = parseInt(a.patientId?.floorNumber || 0, 10);
            const floorB = parseInt(b.patientId?.floorNumber || 0, 10);
            return floorA - floorB;
          }
          if (sortKey === "room") {
            const roomA = parseInt(a.patientId?.roomNumber || 0, 10);
            const roomB = parseInt(b.patientId?.roomNumber || 0, 10);
            return roomA - roomB;
          }
          return 0; // Default for other keys
        });

        // Return the mealTask with the sorted deliveryStatuses
        return {
          ...task,
          deliveryStatuses: sortedStatuses,
        };
        
      })
      .sort((a, b) => {
        // Sort the mealTasks by food instructions if sortKey is "food"
        if (sortKey === "food") {
          const foodA = a.foodId?.instructions || "";
          const foodB = b.foodId?.instructions || "";
          return foodA.localeCompare(foodB); // Alphabetical order
        }
        return 0; // No additional sorting for other keys
      });

    return sortedTasks;
  };
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  const sortedMealTasks = getSortedMealTasks();
  console.log(sortedMealTasks,"sorted meal task ")
  return (
    <>
      <div className="delivery-status-updater-container">
        <h2>Update Delivery Status</h2>

        {/* Sort by dropdown */}
        <div className="sort-container">
          <label htmlFor="sortKey">Sort By: </label>
          <select
            id="sortKey"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
          >
            <option value="floor">Floor</option>
            <option value="room">Room Number</option>
            <option value="food">Food Name</option>
          </select>
        </div>

        {mealTasks.length === 0 ? (
          <p>No meal tasks assigned yet.</p>
        ) : (
          <table className="delivery-status-table">
            <thead>
              <tr>
                <th>Food Name</th>
                <th>Patient Name</th>
                <th>Floor</th>
                <th>Room Number</th>
                <th>Bed Number</th>
                <th>Delivery Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedMealTasks.map((task) =>
                task.deliveryStatuses.map((status) => (
                  
                  <tr key={`${status.patientId}-${status.patientId}`}>
                    <td>{task.foodId?.instructions || "N/A"}</td>
                    <td>{status.patientId?.patientName|| "N/A"}</td>
                    <td>{status.patientId?.floorNumber || "N/A"}</td>
                    <td>{status.patientId?.roomNumber || "N/A"}</td>
                    <td>{status.patientId?.bedNumber || "N/A"}</td>
                    <td>
                      <select
                        value={status.status}
                        onChange={(e) =>
                          updateDeliveryStatus(
                            task._id,
                            status.patientId._id,
                            e.target.value
                          )
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default DeliveryStatusUpdater;
