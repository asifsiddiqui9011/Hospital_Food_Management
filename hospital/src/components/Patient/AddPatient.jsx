import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import './AddPatient.css'
import PatientList from './PatientList';
import AddFoodToPatient from './AddFoodToPatient';
import { useUser } from '../../userContext/userContext';
const AddPatient = () => {


  const { url } = useUser();
    const [patient, setPatient] = useState({
        patientName: "",
        diseases: "",
        allergies: "",
        roomNumber: "",
        bedNumber: "",
        floorNumber: "",
        age: "",
        gender: "",
        emergencyContact: "",
        admissionDate: "",
        dischargeDate: "",
        notes: "",
      });
    
      const changeHandler = (e) => {
        setPatient((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      };    
      const addPatient= async (event) => {
        event.preventDefault();

        const processedPatient = {
            ...patient,
            diseases: patient.diseases.split(",").map((d) => d.trim()),
            allergies: patient.allergies.split(",").map((a) => a.trim()),
          };

        try {
        const response = await axios.post(`${url}/api/patient`, processedPatient, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("auth-token")}`
          },
        });
        console.log("Patient Added Successfully", response.data);
        alert("Patient added successfully!");
        } catch (error) {
        console.error("Error Adding patient", error.response?.data || error.message);
        }
             
    }
            



  return (
    <div className="addmovie-container">
      <h1 className="heading">Add Patient</h1>
      <form onSubmit={addPatient} className="form">
  <span>
    Patient Name:{" "}
    <input
      type="text"
      placeholder="Enter patient name"
      value={patient.patientName || ""}
      name="patientName"
      id="patientName"
      onChange={changeHandler}
      required
    />
  </span>
  <span>
    Diseases:{" "}
    <input
      type="text"
      placeholder="Enter diseases (comma-separated)"
      value={patient.diseases || ""}
      name="diseases"
      id="diseases"
      onChange={changeHandler}
      required
    />
  </span>
  <span>
    Allergies:{" "}
    <input
      type="text"
      placeholder="Enter allergies (comma-separated)"
      value={patient.allergies || ""}
      name="allergies"
      id="allergies"
      onChange={changeHandler}
      required
    />
  </span>
  <span>
    Room Number:{" "}
    <input
      type="text"
      placeholder="Enter room number"
      value={patient.roomNumber || ""}
      name="roomNumber"
      id="roomNumber"
      onChange={changeHandler}
      required
    />
  </span>
  <span>
    Bed Number:{" "}
    <input
      type="text"
      placeholder="Enter bed number"
      value={patient.bedNumber || ""}
      name="bedNumber"
      id="bedNumber"
      onChange={changeHandler}
      required
    />
  </span>
  <span>
    Floor Number:{" "}
    <input
      type="text"
      placeholder="Enter floor number"
      value={patient.floorNumber || ""}
      name="floorNumber"
      id="floorNumber"
      onChange={changeHandler}
      required
    />
  </span>
  <span>
    Age:{" "}
    <input
      type="number"
      placeholder="Enter age"
      value={patient.age || ""}
      name="age"
      id="age"
      onChange={changeHandler}
      required
    />
  </span>
  <span>
    Gender:{" "}
    <select
      name="gender"
      id="gender"
      value={patient.gender || ""}
      onChange={changeHandler}
      required
    >
      <option value="">Select gender</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    </select>
  </span>
  <span>
    Emergency Contact:{" "}
    <input
      type="text"
      placeholder="Enter emergency contact"
      value={patient.emergencyContact || ""}
      name="emergencyContact"
      id="emergencyContact"
      onChange={changeHandler}
      required
    />
  </span>
  <span>
    Admission Date:{" "}
    <input
      type="date"
      value={patient.admissionDate || ""}
      name="admissionDate"
      id="admissionDate"
      onChange={changeHandler}
      required
    />
  </span>
  <span>
    Discharge Date:{" "}
    <input
      type="date"
      value={patient.dischargeDate || ""}
      name="dischargeDate"
      id="dischargeDate"
      onChange={changeHandler}
    />
  </span>
  <span>
    Notes:{" "}
    <textarea
      placeholder="Enter additional notes"
      value={patient.notes || ""}
      name="notes"
      id="notes"
      onChange={changeHandler}
    />
  </span>
  <button type="submit">Add Patient</button>
</form>

<PatientList/>
<AddFoodToPatient/>
    </div>
  )
}

export default AddPatient
