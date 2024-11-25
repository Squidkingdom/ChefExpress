SELECT
  r.recipe_id AS id,
  r.name AS title,
  r.instructions AS description,
  json_agg(
    json_build_object(
      'name',
      i.name,
      'quantity',
      ir.quantity,
      'unit',
      ''
    )
  ) AS ingredients,
  (
    (
      '/images/' :: text || REPLACE(lower((r.name) :: text), ' ' :: text, '_' :: text)
    ) || '.jpg' :: text
  ) AS image
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