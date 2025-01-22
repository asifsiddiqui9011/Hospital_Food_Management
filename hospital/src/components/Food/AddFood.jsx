import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import FoodList from './FoodList';
import './AddFood.css';
import { useUser } from '../../userContext/userContext';

const AddFood = () => {

    const { url } = useUser();
    const [food, setFood] = useState({
        mealType: "",
        ingredients: "",
        instructions: "",
      });

    
      const changeHandler = (e) => {
        setFood((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      };
  
    const addFood= async (event) => {
      event.preventDefault();
     
      const processedFood = {
        ...food,
        ingredients: food.ingredients.split(",").map((ingredient) => ingredient.trim()),
      };
      console.log(processedFood); 
      try {
      const authToken = localStorage.getItem('auth-token');
      const response = await axios.post(`${url}/api/food`, processedFood, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (response.status === 200) {
        alert("Food added successfully!");
      }

      } catch (error) {
      console.error("Error Adding movie", error.response?.data || error.message);
      }
           
  }
  return (
   
    <div className="addfood-container">
    <form onSubmit={addFood} className="form">
      <span style={{textAlign: "center"}}>
      <h2>Add Food</h2>
      </span>
   
      <span>
        Meal Type:{" "}
        <select
          name="mealType"
          value={food.mealType || ""}
          onChange={changeHandler}
          required
        >
          <option value="">Select meal type</option>
          <option value="Morning">Morning</option>
          <option value="Evening">Evening</option>
          <option value="Night">Night</option>
        </select>
      </span>
      <span>
        Ingredients:{" "}
        <input
          type="text"
          placeholder="Enter ingredients (comma-separated)"
          name="ingredients"
          value={food.ingredients || ""}
          onChange={changeHandler}
          required
        />
      </span>
      <span>
        Instructions:{" "}
        <textarea
          placeholder="Enter preparation instructions"
          name="instructions"
          value={food.instructions || ""}
          onChange={changeHandler}
          required
        />
      </span>
      <button type="submit">Add Food</button>
    </form>
    <FoodList/>
  </div>
  
 
  )
}

export default AddFood
