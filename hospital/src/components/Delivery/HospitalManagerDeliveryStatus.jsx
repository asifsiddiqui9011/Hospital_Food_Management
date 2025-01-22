
import React, { useEffect, useState } from "react";
import "./HospitalManagerDeliveryStatus.css";
import { useUser } from "../../userContext/userContext";

const HospitalManagerDeliveryStatus = () => {
  const [mealTasks, setMealTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortKey, setSortKey] = useState("mealType"); // Default sort key
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState(""); // Delivery status filter

  const { url } = useUser();
  // Fetch meal tasks
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

  // Filter and sort meal tasks
  const getFilteredAndSortedMealTasks = () => {
    // Filter by delivery status if a filter is applied
    const filteredTasks = deliveryStatusFilter
      ? mealTasks.map((task) => ({
          ...task,
          deliveryStatuses: task.deliveryStatuses.filter(
            (status) => status.status === deliveryStatusFilter
          ),
        })).filter((task) => task.deliveryStatuses.length > 0) // Remove tasks with no matching statuses
      : mealTasks;

    // Sort tasks based on the selected key
    const sortedTasks = [...filteredTasks].sort((a, b) => {
      if (sortKey === "mealType") {
        const mealA = a.foodId?.mealType || "";
        const mealB = b.foodId?.mealType || "";
        return mealA.localeCompare(mealB);
      }
      if (sortKey === "food") {
        const foodA = a.foodId?.instructions || "";
        const foodB = b.foodId?.instructions || "";
        return foodA.localeCompare(foodB);
      }
      return 0; // Default sorting
    });

    return sortedTasks;
  };

  const filteredAndSortedTasks = getFilteredAndSortedMealTasks();

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="hospital-manager-container">
      <h2>Food Delivery Status</h2>

      {/* Sort Options */}
      <div className="sort-container">
        <div>
          <label htmlFor="sortKey">Sort By: </label>
          <select
            id="sortKey"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
          >
            <option value="mealType">Meal Type</option>
            <option value="food">Food Name</option>
          </select>
        </div>
        <div>
          <fieldset className="delivery-status-filters">
            <legend>Filter by Delivery Status</legend>
            <label>
              <input
                type="radio"
                name="deliveryStatus"
                value=""
                checked={deliveryStatusFilter === ""}
                onChange={() => setDeliveryStatusFilter("")}
              />
              All
            </label>
            <label>
              <input
                type="radio"
                name="deliveryStatus"
                value="Pending"
                checked={deliveryStatusFilter === "Pending"}
                onChange={() => setDeliveryStatusFilter("Pending")}
              />
              Pending
            </label>
            <label>
              <input
                type="radio"
                name="deliveryStatus"
                value="Out for Delivery"
                checked={deliveryStatusFilter === "Out for Delivery"}
                onChange={() => setDeliveryStatusFilter("Out for Delivery")}
              />
              Out for Delivery
            </label>
            <label>
              <input
                type="radio"
                name="deliveryStatus"
                value="Delivered"
                checked={deliveryStatusFilter === "Delivered"}
                onChange={() => setDeliveryStatusFilter("Delivered")}
              />
              Delivered
            </label>
            <label>
              <input
                type="radio"
                name="deliveryStatus"
                value="Failed"
                checked={deliveryStatusFilter === "Failed"}
                onChange={() => setDeliveryStatusFilter("Failed")}
              />
              Failed
            </label>
          </fieldset>
        </div>
      </div>

      {mealTasks.length === 0 ? (
        <p>No meal tasks available.</p>
      ) : (
        <table className="hospital-manager-table">
          <thead>
            <tr>
              <th>Meal Type</th>
              <th>Food Name</th>
              <th>Patient Name</th>
              <th>Floor</th>
              <th>Room</th>
              <th>Bed</th>
              <th>Delivery Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedTasks.map((task) =>
              task.deliveryStatuses.map((status) => (
                <tr key={`${task._id}-${status.patientId}`}>
                  <td>{task.foodId?.mealType || "N/A"}</td>
                  <td>{task.foodId?.instructions || "N/A"}</td>
                  <td>{status.patientId?.patientName || "N/A"}</td>
                  <td>{status.patientId?.floorNumber || "N/A"}</td>
                  <td>{status.patientId?.roomNumber || "N/A"}</td>
                  <td>{status.patientId?.bedNumber || "N/A"}</td>
                  <td>{status.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HospitalManagerDeliveryStatus;
