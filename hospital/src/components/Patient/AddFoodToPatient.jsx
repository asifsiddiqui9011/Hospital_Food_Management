
import React, { useState, useEffect } from "react";
import "./PatientList.css";
import { useUser } from "../../userContext/userContext";

const AddFoodToPatient = () => {

  const { url } = useUser();
  const [patients, setPatients] = useState([]);
  const [foodList, setFoodList] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedFoodId, setSelectedFoodId] = useState(null);
  const [showFoodModal, setShowFoodModal] = useState(false);

  // Fetch patients from backend
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(`${url}/api/patient`);
        if (!response.ok) {
          throw new Error("Failed to fetch patient data");
        }
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatients();
  }, []);

  // Fetch food list from backend
  useEffect(() => {
    const fetchFoodList = async () => {
      try {
        const response = await fetch(`${url}/api/food`);
        if (!response.ok) {
          throw new Error("Failed to fetch food data");
        }
        const data = await response.json();
        setFoodList(data);
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    };

    fetchFoodList();
  }, []);

  const handleAddFoodClick = (patientId) => {
    setSelectedPatientId(patientId);
    setShowFoodModal(true);
  };

  const handleFoodSelect = (foodId) => {
    setSelectedFoodId(foodId);
  };

  const handleAddFoodToPatient = async () => {
    try {
      await fetch(`${url}/api/patient/${selectedPatientId}/add-food`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("auth-token")}`
        },
        body: JSON.stringify({ foodId: selectedFoodId }),
      });

      // Update patient list to reflect the added food
      const response = await fetch(`${url}/api/patient/${selectedPatientId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("auth-token")}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch updated patient data");
      }
      const updatedPatient = await response.json();

      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient._id === selectedPatientId ? updatedPatient : patient
        )
      );

      setShowFoodModal(false);
      setSelectedPatientId(null);
      setSelectedFoodId(null);
      alert("Food successfully assigned to patient");
    } catch (error) {
      console.error("Error adding food to patient:", error);
      alert("Food assignment failed");
    }
  };

  const handleRemoveFoodFromPatient = async (patientId, foodId) => {
    try {
      await fetch(`${url}/api/patient/${patientId}/remove-food`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("auth-token")}`
        },
        body: JSON.stringify({ foodId }),
      });

      // Update patient list to reflect the removed food
      const response = await fetch(`${url}/api/patient/${patientId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("auth-token")}`
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch updated patient data");
      }
      const updatedPatient = await response.json();

      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient._id === patientId ? updatedPatient : patient
        )
      );
      alert("Food successfully removed from patient");
    } catch (error) {
      console.error("Error removing food from patient:", error);
      alert("Failed to remove food from patient");
    }
  };

  const handleModalClose = () => {
    setShowFoodModal(false);
    setSelectedPatientId(null);
    setSelectedFoodId(null);
  };

  return (
    <div className="patient-list">
      <h2 className="patient-list-title">Assign Food To Patients</h2>
      {patients.length === 0 ? (
        <p className="patient-list-empty">No patients available.</p>
      ) : (
        <ul className="patient-items">
          {patients.map((patient) => (
            <li key={patient._id} className="patient-item">
              <p>
                <strong>Name:</strong> {patient.patientName}
              </p>
              <p>
                <strong>Room:</strong> {patient.roomNumber}
              </p>
              <p>
                <strong>Foods:</strong>{" "}
                {patient.foodIds && patient.foodIds.length > 0 ? (
                  <ul>
                    {patient.foodIds.map((food) => (
                      <li key={food._id}>
                        <strong>{food.name}</strong> - {food.mealType}{" "}
                        <span>({food.ingredients.join(", ")})</span>
                        <button
                          onClick={() => handleRemoveFoodFromPatient(patient._id, food._id)}
                          className="button-remove-food"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  "No food assigned"
                )}
              </p>
              <button
                onClick={() => handleAddFoodClick(patient._id)}
                className="button-add-food"
              >
                Add Food
              </button>
            </li>
          ))}
        </ul>
      )}

      {showFoodModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Select Food</h3>
            <ul className="food-list">
              {foodList.map((food) => (
                <li key={food._id}>
                  <label>
                    <input
                      type="radio"
                      name="food"
                      value={food._id}
                      onChange={() => handleFoodSelect(food._id)}
                    />
                    <strong>{food.name}</strong> - {food.mealType}{" "}
                    <span>({food.ingredients.join(", ")})</span>
                  </label>
                </li>
              ))}
            </ul>
            <button
              onClick={handleAddFoodToPatient}
              className="button-add-food-to-patient"
              disabled={!selectedFoodId}
            >
              Add
            </button>
            <button onClick={handleModalClose} className="button-cancel">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddFoodToPatient;
