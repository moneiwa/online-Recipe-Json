import React, { useState, useEffect } from 'react';

function AddRecipeForm({ onSubmit, onClose, formData, onChange, editMode }) {
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    console.log('Form Data:', formData); 
    console.log('Edit Mode:', editMode); 

    if (editMode && formData.imageUrl) {
      setImagePreview(formData.imageUrl); 
    }
  }, [editMode, formData]); 

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    onChange(event); 
    if (file) {
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const handleImageUrlChange = (event) => {
    onChange(event); 
    setImagePreview(event.target.value); 
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close" onClick={onClose}>X</button>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name || ''} // Ensure it doesn't break when formData is empty
            onChange={onChange}
            placeholder="Recipe Name"
          />
          <textarea
            name="instructions"
            value={formData.instructions || ''}
            onChange={onChange}
            placeholder="Instructions"
          />
          <textarea
            name="ingredients"
            value={formData.ingredients || ''}
            onChange={onChange}
            placeholder="Ingredients"
          />
          <input
            type="text"
            name="prepTime"
            value={formData.prepTime || ''}
            onChange={onChange}
            placeholder="Preparation Time"
          />
          <input
            type="text"
            name="category"
            value={formData.category || ''}
            onChange={onChange}
            placeholder="Category"
          />
          <input
            type="text"
            name="CookingTime"
            value={formData.CookingTime || ''}
            onChange={onChange}
            placeholder="Cooking Time"
          />
          <input
            type="text"
            name="servings"
            value={formData.servings || ''}
            onChange={onChange}
            placeholder="Servings"
          />

          {console.log(formData.image)}

          <input
            type="text"
            name="imageUrl"
            value={formData.image || ''} 
            onChange={handleImageUrlChange}
            placeholder="Image URL"
          />

          {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px' }} />}

          <button type="submit">{editMode ? 'Update' : 'Add'} Recipe</button>
        </form>
      </div>
    </div>
  );
}

export default AddRecipeForm;
