function convertNameToUID(name) {
    // remove white spaces replace with '-' for a smexy url
    name = name.replace(/\s/g, "-");
    return name.toLowerCase()
}

function preprocessData(){
	recipe_index_map = parseIndexMap(cocktail_data.recipes, recipe => recipe.name);
	ingredient_index_map = parseIndexMap(cocktail_data.ingredients, ingredient => ingredient.name);
	top_alcoholic_ingredients = cocktail_data
		.ingredients.filter(ingredient => ingredient.abv > 0)
		.sort((a,b) => a.insights.recipe_usage.length < b.insights.recipe_usage.length ? 1 : -1)
		.map(ingredient => ingredient.name);
}


export function parseIndexMap(arr, key_func){
	var result = {};
	for (var i = 0; i < arr.length; i++)
		result[key_func(arr[i])] = i;
	return result;
}