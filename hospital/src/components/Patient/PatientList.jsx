import React, { useState, useEffect } from "react";
import "./PatientList.css";
import { useUser } from "../../userContext/userContext";

const PatientList = () => {

  const { url } = useUser();
  const [patients, setPatients] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    patientName: "",
    diseases: "",
    allergies: "",
    roomNumber: "",
    bedNumber: "",
    floorNumber: "",
    age: "",
    gender: "",
    emergencyContact: "",
    notes: "",
  });

  // Fetch patients from backend
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(`${url}/api/patient`); // Replace with your API URL
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

  // Handle edit
  const handleEditClick = (patient) => {
    setEditingId(patient._id);
    setEditForm({
      patientName: patient.patientName,
      diseases: patient.diseases.join(", "),
      allergies: patient.allergies.join(", "),
      roomNumber: patient.roomNumber,
      bedNumber: patient.bedNumber,
      floorNumber: patient.floorNumber,
      age: patient.age,
      gender: patient.gender,
      emergencyContact: patient.emergencyContact,
      notes: patient.notes,
    });
  };

  const handleSave = async (id) => {
    try {
      const updatedPatient = {
        ...editForm,
        diseases: editForm.diseases.split(",").map((d) => d.trim()),
        allergies: editForm.allergies.split(",").map((a) => a.trim()),
      };
      const response = await fetch(`${url}/api/patient/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("auth-token")}`
        },
        body: JSON.stringify(updatedPatient),
      });

      if (response.ok) {
        alert("Patient updated successfully!");
        const updatedPatients = await response.json();
        setPatients((prev) =>
          prev.map((patient) =>
        patient._id === id ? { ...patient, ...updatedPatients } : patient
          )
        );
        setEditingId(null);
      } else {
        alert("Failed to update patient.");
      }
        } catch (error) {
      console.error("Error updating patient:", error);
      alert("An error occurred while updating the patient.");
    }
  };

  // Handle remove
  const handleRemove = async (id) => {
      try {
        const response = await fetch(`${url}/api/patient/${id}`, {
          method: "DELETE",
          headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("auth-token")}`
          },
        });

        if (response.ok) {
          alert("Patient removed successfully!");
          setPatients((prev) => prev.filter((patient) => patient._id !== id));
        } else {
          alert("Failed to remove patient.");
        }
      } 
        catch (error) {
      console.error("Error deleting patient:", error);
      alert("An error occurred while removing the patient.");
    }
  };

  return (
    <div className="patient-list">
      <h2 className="patient-list-title">Patient List</h2>
      {patients.length === 0 ? (
        <p className="patient-list-empty">No patients available.</p>
      ) : (
        <ul className="patient-items">
          {patients.map((patient) => (
            <li key={patient._id} className="patient-item">
              {editingId === patient._id ? (
                <div className="edit-form">
                <input
                  type="text"
                  name="patientName"
                  value={editForm.patientName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, patientName: e.target.value })
                  }
                  className="edit-input"
                  placeholder="Patient Name"
                />
                <input
                  type="text"
                  name="diseases"
                  value={editForm.diseases}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      diseases: e.target.value.split(",").map((d) => d.trim()),
                    })
                  }
                  className="edit-input"
                  placeholder="Diseases (comma-separated)"
                />
                <input
                  type="text"
                  name="allergies"
                  value={editForm.allergies}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      allergies: e.target.value.split(",").map((a) => a.trim()),
                    })
                  }
                  className="edit-input"
                  placeholder="Allergies (comma-separated)"
                />
                <input
                  type="text"
                  name="roomNumber"
                  value={editForm.roomNumber}
                  onChange={(e) =>
                    setEditForm({ ...editForm, roomNumber: e.target.value })
                  }
                  className="edit-input"
                  placeholder="Room Number"
                />
                <input
                  type="text"
                  name="bedNumber"
                  value={editForm.bedNumber}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bedNumber: e.target.value })
                  }
                  className="edit-input"
                  placeholder="Bed Number"
                />
                <input
                  type="text"
                  name="floorNumber"
                  value={editForm.floorNumber}
                  onChange={(e) =>
                    setEditForm({ ...editForm, floorNumber: e.target.value })
                  }
                  className="edit-input"
                  placeholder="Floor Number"
                />
                <input
                  type="number"
                  name="age"
                  value={editForm.age}
                  onChange={(e) =>
                    setEditForm({ ...editForm, age: parseInt(e.target.value) })
                  }
                  className="edit-input"
                  placeholder="Age"
                />
                <select
                  name="gender"
                  value={editForm.gender}
                  onChange={(e) =>
                    setEditForm({ ...editForm, gender: e.target.value })
                  }
                  className="edit-select"
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="text"
                  name="emergencyContact"
                  value={editForm.emergencyContact}
                  onChange={(e) =>
                    setEditForm({ ...editForm, emergencyContact: e.target.value })
                  }
                  className="edit-input"
                  placeholder="Emergency Contact"
                />
                <input
                  type="date"
                  name="dischargeDate"
                  value={editForm.dischargeDate ? editForm.dischargeDate.split("T")[0] : ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, dischargeDate: e.target.value })
                  }
                  className="edit-input"
                />
                <textarea
                  name="notes"
                  value={editForm.notes}
                  onChange={(e) =>
                    setEditForm({ ...editForm, notes: e.target.value })
                  }
                  className="edit-textarea"
                  placeholder="Additional Notes"
                ></textarea>
              
                <button
                  onClick={() => handleSave(patient._id)}
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
                  <p>
                    <strong>Name:</strong> {patient.patientName}
                  </p>
                  <p>
                    <strong>Diseases:</strong> {patient.diseases.join(", ")}
                  </p>
                  <p>
                    <strong>Room:</strong> {patient.roomNumber}
                  </p>
                  <p>
                    <strong>Bed Number:</strong> {patient.bedNumber}
                  </p>
                  <p>
                    <strong>Floor Number:</strong> {patient.floorNumber}
                  </p>
                  <p>
                    <strong>Age:</strong> {patient.age}
                  </p>
                  <p>
                    <strong>Gender:</strong> {patient.gender}
                  </p>
                  <p>
                    <strong>Emergency Contact:</strong> {patient.emergencyContact}
                  </p>
                  <p>
                    <strong>Admission Date:</strong>{" "}
                    {new Date(patient.admissionDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Discharge Date:</strong>{" "}
                    {patient.dischargeDate
                      ? new Date(patient.dischargeDate).toLocaleDateString()
                      : "Not Discharged"}
                  </p>
                  <p>
                    <strong>Notes:</strong> {patient.notes || "No additional notes"}
                  </p>
                  <p>
                <strong>Foods:</strong>{" "}
                {patient.foodIds && patient.foodIds.length > 0 ? (
                    <ul>
                    {patient.foodIds.map((food) => (
                        <li key={food._id}>
                        <strong>Meal Type:</strong> {food.mealType} | 
                        <strong> Ingredients:</strong> {food.ingredients.join(", ")} | 
                        <strong> Instructions:</strong> {food.instructions}
                        </li>
                    ))}
                    </ul>
                ) : (
                    "No food assigned"
                )}
                </p>
                  <button
                    onClick={() => handleEditClick(patient)}
                    className="button-edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemove(patient._id)}
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

export default PatientList;

