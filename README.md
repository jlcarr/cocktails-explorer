# cocktails-explorer
An HTML, JavaScript and SVG project using D3 to explore the IBA official cocktails dataset.

## Data
The idea was to preprocess the data, and do all the fun computations in the Jupyter notebook, then dump the results to a neatly formatted json file which would be loaded by the site to present the data.
### Schema
#### Recipes
```
[
	{
		"name": string,
		"ingredients":
			[
				{
					"name": string,
					"amount": float
				}
			],
		"special_ingredients":
			[
				string
			],
		"volume": float,
		"garnish": string,
		"glass": string,
		"preparation": string,
		"image_url": string,
		"insights":
			{
				"abv": float,
				"primary_alcohol": string,
				"similar_recipes":
					[
						{
							"name": string,
							"similarity": float,
						}
					]
			}
	}
]
```

- `abv`: Is the fraction of alcohol in the drink.
- `volume`: Is the volume of the drink in ml.
- `amount`: Is the fraction of the drink composed of the ingredient.
- `similarity`: Is the fraction of a drink the two have in common. (e.g. any recipe would have a similarity of 1.0 with itself)

#### Ingredients
```
[
	{
		"name": string,
		"abv": float,
		"image_url": string,
		"insights":
			{
				"recipe_usage":
					[
						{
							"name": string,
							"amount": float
						}
					],
				"paired_ingredients":
					[
						{
							"name": string,
							"number_recipes" int
						}
					]
			}
	}
]
```

- `abv`: Is the fraction of alcohol in the ingredient.
- `recipe_usage`: Is the list of recipes containing the ingredient. The length is therefore the number of recipes it's used in.
- `amount`: Is the fraction of the drink composed of the ingredient.
- `number_recipes`: Is the number of recipes in common between the two ingredients.


## Resources
- https://en.wikipedia.org/wiki/List_of_IBA_official_cocktails
- https://iba-world.com/iba-official-cocktail-list/
- Dataset: https://github.com/teijo/iba-cocktails
- D3 Force-Direct Graph Example: https://bl.ocks.org/heybignick/3faf257bbbbc7743bb72310d03b86ee8
- D3 Force-Directed Graph documentation: https://github.com/d3/d3-force
