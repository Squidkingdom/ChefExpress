SELECT
  r.id,
  r.name AS title,
  r.instructions,
  r.description,
  r.owner_id,
  r.image,
  json_agg(
    json_build_object('name', i.name, 'quantity', ir.quantity)
  ) AS ingredients
FROM
  (
    (
      "Recipe" r
      LEFT JOIN ingrediantinrecipe ir ON ((r.id = ir.recipe_id))
    )
    LEFT JOIN "Ingredient" i ON ((ir.ingredient_id = i.ingredient_id))
  )
GROUP BY
  r.name,
  r.id,
  r.instructions,
  r.description;