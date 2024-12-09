/***************************************************************************************************
 * Name of code artifact: UploadRecipe.tsx
 * Brief description of what the code does:
 *   This component provides a form for users to create and share a new recipe by inputting 
 *   its title, description, ingredients, instructions, and uploading an image. It uses React 
 *   Query's useMutation for the createRecipe API call, and displays success/error notifications 
 *   via react-toastify. On success, it resets the form and invalidates the "recipes" query 
 *   to refresh the displayed recipes.
 * Programmer’s name: Programmer 1
 * Date the code was created: Date 1
 * Dates the code was revised: Date 2
 * Brief description of each revision & author:
 *   Date 2 - Programmer 1: Added ingredient entry functionality, file upload support, 
 *   integrated React Query for server-side operations, and improved form validation with 
 *   toast notifications.
 * Preconditions:
 *   - React environment, React Query, react-toastify must be set up.
 *   - The backend endpoint (`http://localhost:3000/api/recipe`) must accept multipart/form-data 
 *     POST requests with title, description, instructions, ingredients (JSON), and an image.
 * Acceptable and unacceptable input values or types, and their meanings:
 *   - All fields (title, description, ingredients, instructions, and image) must be non-empty.
 *   - If any field is missing, the operation will not proceed and an error toast is shown.
 * Postconditions:
 *   - On success, the recipe is created on the server, the user sees a success toast, 
 *     and the local form resets.
 * Return values or types:
 *   - Returns a React Functional Component (JSX.Element).
 * Error and exception condition values or types:
 *   - If server request fails, shows an error toast to the user.
 * Side effects:
 *   - Invalidates the "recipes" query in React Query, causing displayed recipes to refresh.
 * Invariants:
 *   - The form layout and logic for adding ingredients remain consistent.
 * Any known faults:
 *   - If the backend schema changes, the upload might fail or need adjustments.
 * Comments summarizing major blocks of code:
 *   - State management for recipe form fields including dynamic ingredient addition.
 *   - File input for image upload.
 *   - createRecipe function sends multipart/form-data to the server.
 *   - useMutation for handling create recipe request with success/error callbacks.
 * Comments on every line are provided below.
 ***************************************************************************************************/

// Imports for React hooks and dependencies
import React, { ChangeEvent, useState } from 'react';
import { Ingredient, Recipe } from '../subcomponents/RecipeCard';
import { toast } from 'react-toastify';
import { FaPlus } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * createRecipe function:
 * Sends a POST request to the backend to create a new recipe, including:
 *  - title, description, instructions (as form fields)
 *  - ingredients (as JSON string)
 *  - image (as file)
 */
async function createRecipe(recipe: Recipe, image: File) {
  const formData = new FormData();
  formData.append('title', recipe.title);
  formData.append('description', recipe.description);
  formData.append('instructions', recipe.instructions);
  formData.append('ingredients', JSON.stringify(recipe.ingredients));
  formData.append('image', image);

  const response = await fetch('http://localhost:3000/api/recipe', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Error creating recipe');
  }

  return response;
}

/**
 * UploadRecipe component:
 * Renders a form for creating a new recipe with image upload and ingredient additions.
 * Uses a mutation to send the data to the server and handles success/error with toasts.
 */
export const UploadRecipe: React.FC = () => {
  // State for the form data, matching Recipe interface
  const [formData, setFormData] = useState<Recipe>({
    id: 0,
    title: '',
    description: '',
    ingredients: [],
    instructions: '',
    image: null,
  });

  // State for a single new ingredient to add
  const [newIngredient, setNewIngredient] = useState<Ingredient>({
    name: '',
    quantity: '',
  });

  // State for the selected image file
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Access QueryClient for invalidating queries after mutation
  const queryClient = useQueryClient();

  // Set up mutation for recipe creation
  const { mutate } = useMutation({
    mutationFn: () => {
      if (!selectedImage) {
        return Promise.reject(new Error('No image selected'));
      }
      return createRecipe(formData, selectedImage);
    },
    onSuccess: () => {
      toast.success('Recipe created successfully!');
      // Invalidate the "recipes" query to refresh displayed recipes
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      // Reset the form after a successful creation
      setFormData({
        id: 0,
        title: '',
        description: '',
        ingredients: [],
        instructions: '',
        image: null,
      });
      setSelectedImage(null);
      setNewIngredient({ name: '', quantity: '' });
    },
    onError: (error: unknown) => {
      console.error(error);
      toast.error('Failed to create recipe. Please try again.');
    },
  });

  /**
   * handleShareRecipe:
   * Validates that all fields are filled. If so, triggers mutation to create the recipe.
   * If not, shows an error toast.
   */
  const handleShareRecipe = () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.instructions ||
      formData.ingredients.length === 0 ||
      !selectedImage
    ) {
      toast.error('Please complete all fields and upload an image.');
      return;
    }

    mutate();
  };

  /**
   * handleImageChange:
   * Captures the selected file from input and sets it to selectedImage state.
   */
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  /**
   * handleInputChange:
   * Updates the formData state with new values for title, description, instructions.
   */
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * handleAddIngredient:
   * Adds a new ingredient to the recipe if both name and quantity are provided.
   * Resets the newIngredient state after addition.
   * If fields are empty, shows an error toast.
   */
  const handleAddIngredient = () => {
    if (newIngredient.name && newIngredient.quantity) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredient],
      }));
      setNewIngredient({ name: '', quantity: '' });
    } else {
      toast.error('Please complete all ingredient fields.');
    }
  };

  /**
   * handleIngredientInput:
   * Updates the newIngredient state as the user types name or quantity.
   */
  const handleIngredientInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewIngredient({ ...newIngredient, [name]: value });
  };

  // Render the form
  return (
    <div>
      <section className="w-full max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-md mb-16">
        <h2 className="text-3xl font-bold text-center text-teal-400 mb-6">
          Share a Recipe
        </h2>
        <div className="space-y-4">
          {/* Title input */}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Recipe Title"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          {/* Description input */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            rows={3}
          ></textarea>

          {/* Ingredients section */}
          <div>
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                name="name"
                value={newIngredient.name}
                onChange={handleIngredientInput}
                placeholder="Ingredient"
                className="flex-grow px-4 py-2 bg-gray-900 border border-gray-700 rounded-md"
              />
              <input
                type="text"
                name="quantity"
                value={newIngredient.quantity}
                onChange={handleIngredientInput}
                placeholder="Quantity"
                className="w-24 px-4 py-2 bg-gray-900 border border-gray-700 rounded-md"
              />
              <button
                type="button"
                onClick={handleAddIngredient}
                className="px-4 py-2 bg-teal-500 text-gray-900 rounded-md hover:bg-teal-400"
              >
                Add Ingredient
              </button>
            </div>
            <ul className="list-disc list-inside mt-2 text-gray-300">
              {formData.ingredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.quantity} {ingredient.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions input */}
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleInputChange}
            placeholder="Instructions"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            rows={4}
          ></textarea>

          {/* Image upload */}
          <div className="flex items-center">
            <label className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-teal-400">
              <FaPlus className="text-2xl text-gray-900" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <p className="ml-4 text-gray-300">
              {selectedImage ? selectedImage.name : 'Upload an image'}
            </p>
          </div>

          {/* Submit button */}
          <button
            onClick={handleShareRecipe}
            className="w-full bg-teal-500 text-gray-900 py-3 rounded-full hover:bg-teal-400"
          >
            Share Recipe
          </button>
        </div>
      </section>
    </div>
  );
};


// import React, { ChangeEvent, useState } from 'react';
// import { Ingredient, Recipe } from '../subcomponents/RecipeCard';
// import { toast } from 'react-toastify';
// import { FaPlus } from 'react-icons/fa';
// import { useMutation, useQueryClient } from '@tanstack/react-query';

// async function createRecipe(recipe: Recipe, image: File) {
//   const formData = new FormData();
//   formData.append('title', recipe.title);
//   formData.append('description', recipe.description);
//   formData.append('instructions', recipe.instructions);

//   // Append ingredients as JSON string
//   formData.append('ingredients', JSON.stringify(recipe.ingredients));

//   // Append image file
//   formData.append('image', image);

//   const response = await fetch('http://localhost:3000/api/recipe', {
//     method: 'POST',
//     body: formData,
//   });

//   if (!response.ok) {
//     throw new Error('Error creating recipe');
//   }

//   return response;
// }

// export const UploadRecipe: React.FC = () => {
//   const [formData, setFormData] = useState<Recipe>({
//     id: 0,
//     title: '',
//     description: '',
//     ingredients: [],
//     instructions: '',
//     image: null,
//   });

//   const [newIngredient, setNewIngredient] = useState<Ingredient>({
//     name: '',
//     quantity: '',
//   });

//   const [selectedImage, setSelectedImage] = useState<File | null>(null);

  
//   const queryClient = useQueryClient();
//   // Set up the mutation
//   const { mutate } = useMutation({
//     mutationFn: () => {
//       if (!selectedImage) {
//         return Promise.reject(new Error('No image selected'));
//       }
//       return createRecipe(formData, selectedImage);
//     },
//     onSuccess: () => {
//       toast.success('Recipe created successfully!');
//     //   queryClient.invalidateQueries(["recipes"]);
//       // Optionally, invalidate queries to refresh data
//       queryClient.invalidateQueries({queryKey: ["recipes"]});
//       // Reset form after success
//       setFormData({
//         id: 0,
//         title: '',
//         description: '',
//         ingredients: [],
//         instructions: '',
//         image: null,
//       });
//       setSelectedImage(null);
//       setNewIngredient({ name: '', quantity: '' });
//     },
//     onError: (error: unknown) => {
//       console.error(error);
//       toast.error('Failed to create recipe. Please try again.');
//     },
//   });

//   const handleShareRecipe = () => {
//     if (
//       !formData.title ||
//       !formData.description ||
//       !formData.instructions ||
//       formData.ingredients.length === 0 ||
//       !selectedImage
//     ) {
//       toast.error('Please complete all fields and upload an image.');
//       return;
//     }

//     mutate();
//   };

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setSelectedImage(e.target.files[0]);
//     }
//   };

//   const handleInputChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleAddIngredient = () => {
//     if (newIngredient.name && newIngredient.quantity) {
//       setFormData((prev) => ({
//         ...prev,
//         ingredients: [...prev.ingredients, newIngredient],
//       }));
//       setNewIngredient({ name: '', quantity: '' });
//     } else {
//       toast.error('Please complete all ingredient fields.');
//     }
//   };

//   const handleIngredientInput = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setNewIngredient({ ...newIngredient, [name]: value });
//   };

//   return (
//     <div>
//       <section className="w-full max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-md mb-16">
//         <h2 className="text-3xl font-bold text-center text-teal-400 mb-6">
//           Share a Recipe
//         </h2>
//         <div className="space-y-4">
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={handleInputChange}
//             placeholder="Recipe Title"
//             className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
//           />

//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleInputChange}
//             placeholder="Description"
//             className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
//             rows={3}
//           ></textarea>

//           <div>
//             <div className="flex flex-wrap gap-2">
//               <input
//                 type="text"
//                 name="name"
//                 value={newIngredient.name}
//                 onChange={handleIngredientInput}
//                 placeholder="Ingredient"
//                 className="flex-grow px-4 py-2 bg-gray-900 border border-gray-700 rounded-md"
//               />
//               <input
//                 type="text"
//                 name="quantity"
//                 value={newIngredient.quantity}
//                 onChange={handleIngredientInput}
//                 placeholder="Quantity"
//                 className="w-24 px-4 py-2 bg-gray-900 border border-gray-700 rounded-md"
//               />
//               <button
//                 type="button"
//                 onClick={handleAddIngredient}
//                 className="px-4 py-2 bg-teal-500 text-gray-900 rounded-md hover:bg-teal-400"
//               >
//                 Add Ingredient
//               </button>
//             </div>
//             <ul className="list-disc list-inside mt-2 text-gray-300">
//               {formData.ingredients.map((ingredient, index) => (
//                 <li key={index}>
//                   {ingredient.quantity} {ingredient.name}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <textarea
//             name="instructions"
//             value={formData.instructions}
//             onChange={handleInputChange}
//             placeholder="Instructions"
//             className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
//             rows={4}
//           ></textarea>

//           <div className="flex items-center">
//             <label className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-teal-400">
//               <FaPlus className="text-2xl text-gray-900" />
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//             </label>
//             <p className="ml-4 text-gray-300">
//               {selectedImage ? selectedImage.name : 'Upload an image'}
//             </p>
//           </div>

//           <button
//             onClick={handleShareRecipe}
//             className="w-full bg-teal-500 text-gray-900 py-3 rounded-full hover:bg-teal-400"
//           >
//           Share Recipe
//           </button>
//         </div>
//       </section>
//     </div>
//   );
// };
