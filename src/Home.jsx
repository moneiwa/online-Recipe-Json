import React, { useEffect, useRef, useState } from 'react';
import Axios from 'axios';
import './index.css';

function Home({ onLogout }) {
  const [recipe, setRecipe] = useState(null);
  const [input, setInput] = useState('');
  const [recipeList, setRecipeList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '', instructions: '',   ingredients: '', prepTime: '',category: '',CookingTime: '',
    servings: '',
    file: null,
    image: '', 
  });

  const [visibleInstructions, setVisibleInstructions] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [recipeRatings, setRecipeRatings] = useState({}); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Axios.get('http://localhost:3000/recipes');
        setRecipeList(res.data);
      } catch (error) {
        console.error("Error fetching data from server:", error);
      }
    };
    fetchData();
  }, []);

  const handleRateRecipe = async (id, rating) => {
    try {
      setRecipeRatings((prevRatings) => ({
        ...prevRatings,
        [id]: rating
      }));

      await Axios.put(`http://localhost:3000/recipes/${id}`, { rating });

    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  const toggleInstructions = (id) => {
    setVisibleInstructions((prevState) => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const formatInstructions = (instructions) => {
    return instructions.split(/[\r\n]+/).filter(line => line.trim() !== '');
  };

  const filteredRecipes = recipeList.filter((recipe) =>
    recipe.name && recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChange = (event) => {
    const { name, value, type, files } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, instructions, ingredients, prepTime, category, CookingTime, servings, file } = formData;

    if (name && instructions && ingredients && prepTime && category) {
      try {
       
        const dataToSend = {
          name,
          instructions,
          ingredients,
          prepTime,
          category,
          CookingTime,
          servings,
          image: file ? URL.createObjectURL(file) : formData.image 
        };

        const url = editMode
          ? `http://localhost:3000/recipes/${editingRecipeId}`
          : 'http://localhost:3000/recipes';

        const method = editMode ? 'put' : 'post';

        await Axios({ method, url, data: dataToSend, headers: { 'Content-Type': 'application/json' } });

      
        setFormData({
          name: '',
          instructions: '',
          ingredients: '',
          prepTime: '',
          category: '',
          CookingTime: '',
          servings: '',
          file: null,
          image: ''
        });

        setEditMode(false);
        setEditingRecipeId(null);
        setIsFormVisible(false);

      
        const res = await Axios.get('http://localhost:3000/recipes');
        setRecipeList(res.data);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    } else {
      alert("Please fill out all fields.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await Axios.delete(`http://localhost:3000/recipes/${id}`);
      setRecipeList((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== id));
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const handleEdit = (recipe) => {
    setEditingRecipeId(recipe.id);
    setFormData({
      name: recipe.name,
      instructions: recipe.instructions,
      ingredients: recipe.ingredients,
      prepTime: recipe.prepTime,
      category: recipe.category,
      CookingTime: recipe.CookingTime,
      servings: recipe.servings,
      image: recipe.image, 
      file: null, 
    });
    setEditMode(true);
    setIsFormVisible(true);
  };

  return (
    <div className="mai">
      <div className="main-container">
        <div className="side-image-container">   
           <button className="logout-button" onClick={onLogout}>
        Logout
      </button>
          <img
            // src="https://images.pexels.com/photos/4346328/pexels-photo-4346328.jpeg?auto=compress&cs=tinysrgb&600"
            // alt="Finest Green Side Image"
            className="side-image" />
         
        </div>

        <div>
          <nav className="navbar">
            <h1>Recipe App</h1>
          </nav>

          <div className="containerr">
            <input
              className="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter recipe name" />

            <button className="button" onClick={() => setIsFormVisible(!isFormVisible)}>
              {isFormVisible ? 'Cancel' : 'Add Recipe'}
            </button>

            {isFormVisible && (
              <div className="form-wrapper">
                <form className="form-d" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Recipe Name" />
                  <textarea
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    placeholder="Instructions" />
                  <textarea
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleChange}
                    placeholder="Ingredients" />
                  <input
                    type="text"
                    name="prepTime"
                    value={formData.prepTime}
                    onChange={handleChange}
                    placeholder="Preparation Time" />
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Category" />
                  <input
                    type="text"
                    name="CookingTime"
                    value={formData.CookingTime}
                    onChange={handleChange}
                    placeholder="Cooking Time" />
                  <input
                    type="text"
                    name="servings"
                    value={formData.servings}
                    onChange={handleChange}
                    placeholder="Servings" />
                  <input
                    type="file"
                    name="file"
                    onChange={handleChange} />
                  <button className="button" type="submit">{editMode ? 'Update' : 'Add'}</button>
                </form>
              </div>
            )}

            {recipe && (
              <div className="recipe-detail">
                <h2>{recipe.strMeal}</h2>
                <img src={recipe.strMealThumb} alt={recipe.strMeal} className="recipe-image" />
                <p className="recipe-instructions">{recipe.strInstructions}</p>
                <button className="button" onClick={handleSaveRecipe}>
                  Save Recipe
                </button>
              </div>
            )}

            <div className="latest-recipes">
              <h2>Latest recipes</h2>
              <input
                className="input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in saved recipes" />
            </div>

            {filteredRecipes.length > 0 ? (
              <div className="container__text">
                {filteredRecipes.map((rec) => (
                  <div className="recipe-card" key={rec.id}>
                    <img src={rec.image} alt={rec.name} />
                    <h3>{rec.name}</h3>
                    <p>Category: {rec.category}</p>
                    <p>Prep Time: {rec.prepTime}</p>
                    <p>Cooking Time: {rec.CookingTime}</p>
                    <p>Servings: {rec.servings}</p>
                    <p>{rec.description}</p>

                    <div className="rating">
                      <span>Rate this recipe:</span>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <a
                          key={rating}
                          onClick={() => handleRateRecipe(rec.id, rating)}
                          className={recipeRatings[rec.id] >= rating ? 'rated' : ''}>
                          ★
                        </a>
                      ))}
                      <p>Current Rating: {recipeRatings[rec.id] || 'No rating yet'}</p>
                    </div>

                    <button className="view-button" onClick={() => toggleInstructions(rec.id)}>
                      {visibleInstructions[rec.id] ? 'Hide Instructions' : 'Show Instructions'}
                    </button>
                    {visibleInstructions[rec.id] && (
                      <div className="instructions-container">
                        <ul className="instructions-list">
                          {formatInstructions(rec.instructions).map((step, index) => (
                            <li key={index}>{step.trim()}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <button className="button" onClick={() => handleDelete(rec.id)}>Delete</button>
                    <button className="button" onClick={() => handleEdit(rec)}>Edit</button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No recipes found</p>
            )}
          </div>
        </div>
      </div>
  
    </div>
  );
}

export default Home;
