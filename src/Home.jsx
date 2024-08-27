import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import './index.css';
mmm
function Home({ onLogout }) {
  const [recipe, setRecipe] = useState(null);
  const [input, setInput] = useState('');
  const [recipeList, setRecipeList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '', instructions: '', ingredients: '', prepTime: '', category: '', file: null 
  });

  const [visibleInstructions, setVisibleInstructions] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const getRecipe = async () => {
    try {
      const resp = await Axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`);
      if (resp.data.meals) {
        const meal = resp.data.meals[0];
        setRecipe(meal);
      } else {
        alert("No recipe found");
        setRecipe(null);
      }
    } catch (e) {
      console.error("Error fetching recipe from API:", e);
    }
  };

  const handleSaveRecipe = async () => {
    if (recipe) {
      try {
        const dataToSend = {
          name: recipe.strMeal,
          instructions: recipe.strInstructions,
          ingredients: recipe.strIngredients,
          prepTime: 'N/A',  
          category: recipe.strCategory,
          image: recipe.strMealThumb
        };

        await Axios.post('http://localhost:3000/recipes', dataToSend, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const res = await Axios.get('http://localhost:3000/recipes');
        setRecipeList(res.data);
        setRecipe(null);
      } catch (error) {
        console.error("Error saving recipe:", error);
      }
    }
  };

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

  const handleChange = (event) => {
    const { name, value, type, files } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, instructions, ingredients, prepTime, category } = formData;

    if (name && instructions && ingredients && prepTime && category) {
      try {
        const dataToSend = {
          name, instructions, ingredients, prepTime, category
        };

        const url = editMode
          ? `http://localhost:3000/recipes/${editingRecipeId}`
          : 'http://localhost:3000/recipes';

        const method = editMode ? 'put' : 'post';

        await Axios({
          method,
          url,
          data: dataToSend,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        setFormData({
          name: '', instructions: '', ingredients: '', prepTime: '', category: '', file: null
        });

        setEditMode(false);
        setEditingRecipeId(null);
        setIsFormVisible(false);

        const res = await Axios.get('http://localhost:3000/recipes');
        setRecipeList(res.data);
      } catch (error) {
        console.error("Error submitting form:", error.response ? error.response.data : error.message);
      }
    } else {
      alert("Please fill out all fields.");
    }
  };

  const handleEdit = (recipe) => {
    setFormData({
      name: recipe.name,
      instructions: recipe.instructions,
      ingredients: recipe.ingredients,
      prepTime: recipe.prepTime,
      category: recipe.category,
      file: null
    });
    setEditMode(true);
    setEditingRecipeId(recipe.id);
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await Axios.delete(`http://localhost:3000/recipes/${id}`);
      const res = await Axios.get('http://localhost:3000/recipes');
      setRecipeList(res.data);
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const toggleInstructions = (id) => {
    setVisibleInstructions(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const formatInstructions = (instructions) => {
    return instructions.split(/[\r\n]+/).filter(line => line.trim() !== '');
  };

  const filteredRecipes = recipeList.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <nav className='navbar'>
        <h1>Recipe App</h1>
        <button className='onlogout' onClick={onLogout}>Logout</button>
      </nav>

      <div className='containerr'>
        <input
          className='input'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter recipe name"
        />
        <button className="buttonn" onClick={getRecipe}>Search</button>

        <button className="button" onClick={() => setIsFormVisible(!isFormVisible)}>
          {isFormVisible ? 'Cancel' : 'Add Recipe'}
        </button>

        {isFormVisible && (
          <div className="form-wrapper">
            <form className='form-d' onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Recipe Name"
              />
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                placeholder="Instructions"
              />
              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                placeholder="Ingredients"
              />
              <input
                type="text"
                name="prepTime"
                value={formData.prepTime}
                onChange={handleChange}
                placeholder="Preparation Time"
              />
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category"
              />
              <input
                type="file"
                name="file"
                onChange={handleChange}
              />
              <button className="button" type="submit">{editMode ? 'Update' : 'Add'}</button>
            </form>
          </div>
        )}

        {recipe && (
          <div className='recipe-detail'>
            <h2>{recipe.strMeal}</h2>
            <img src={recipe.strMealThumb} alt={recipe.strMeal} className='recipe-image' />
            <p className='recipe-instructions'>{recipe.strInstructions}</p>
            <button className="button" onClick={handleSaveRecipe}>
              Save Recipe
            </button>
          </div>
        )}

        <div className="latest-recipes">
          <h2>Latest recipes</h2>
          <input
            className='input'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in saved recipes"
          />
        </div>

        {filteredRecipes.length > 0 ? (
          <div className='container__text'>
            {filteredRecipes.map((rec) => (
              <div className='recipe-card' key={rec.id}>
                <img src={rec.image} alt={rec.name} />
                <h3>{rec.name}</h3>
                <p>Category: {rec.category}</p>
                <p>Prep Time: {rec.prepTime}</p>
                <p>Ingredients: {rec.ingredients}</p>
                <p>{rec.description}</p>
                <button className='view-button' onClick={() => toggleInstructions(rec.id)}>
                  {visibleInstructions[rec.id] ? 'Hide Instructions' : 'Show Instructions'}
                </button>
                {visibleInstructions[rec.id] && (
                  <div className='instructions-container'>
                    <ul className='instructions-list'>
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
  );
}

export default Home;
