SELECT
  r.recipe_id AS id,
  r.name AS title,
  r.instructions AS description,
  r.owner_id,
  r.image,
  json_agg(
    json_build_object('name', i.name, 'quantity', ir.quantity)
  ) AS ingredients
FROM
  (
    (
      "Recipe" r
      LEFT JOIN ingrediantinrecipe ir ON (((r.recipe_id) :: text = (ir.recipe_id) :: text))
    )
    LEFT JOIN "Ingredient" i ON (
      (
        (ir.ingredient_id) :: text = (i.ingredient_id) :: text
      )
    )
  )
GROUP BY
  r.recipe_id,
  r.name,
  r.instructions;