/*
  SQL query for the 'recipeview' view.
  This query joins data from the Recipe, Ingrediantinrecipe, and Ingredient tables 
  to create a view with recipe details along with its associated ingredients and their quantities.
  
  Programmer: [Your Name]
  Date Created: [Creation Date]
  Last Revised: [Date of Last Revision]
  Revision History: [Any changes made along with dates and author names]
*/

/* 
  Select relevant columns from the Recipe table (r) and join with Ingrediantinrecipe (ir) 
  and Ingredient (i) to include ingredient details.
*/
SELECT
  r.id,                             -- Recipe ID (primary key)
  r.name AS title,                  -- Name of the recipe (alias as 'title')
  r.instructions,                   -- Instructions for preparing the recipe
  r.description,                    -- Description of the recipe
  r.owner_id,                       -- Owner of the recipe (user UUID)
  r.image,                          -- Image associated with the recipe
  /* 
    Aggregating ingredients and their quantities for the recipe.
    json_agg() collects multiple rows into a JSON array.
    json_build_object() creates a JSON object with 'name' and 'quantity' for each ingredient.
  */
  json_agg(
    json_build_object('name', i.name, 'quantity', ir.quantity)
  ) AS ingredients   -- List of ingredients as a JSON array with their names and quantities

FROM
  (
    -- Joining Recipe table (r) with Ingrediantinrecipe table (ir) based on recipe_id
    "Recipe" r
    LEFT JOIN ingrediantinrecipe ir ON r.id = ir.recipe_id  -- LEFT JOIN ensures all recipes are included even if they don't have ingredients

    -- Joining Ingrediantinrecipe table (ir) with Ingredient table (i) based on ingredient_id
    LEFT JOIN "Ingredient" i ON ir.ingredient_id = i.ingredient_id  -- LEFT JOIN ensures that even ingredients without matching entries in the ingredient table are included
  )

/*
  Grouping the results by the recipe's ID and other relevant fields to ensure that 
  ingredients are aggregated correctly for each recipe.
*/
GROUP BY
  r.name,                           -- Group by recipe name
  r.id,                             -- Group by recipe ID (unique)
  r.instructions,                   -- Group by instructions
  r.description;                    -- Group by description of the recipe