// Force-directed graph map of IBA official cocktails

var cocktail_data = null;
var recipe_index_map = null;
var ingredient_index_map = null;

function fetchIBADataset(){
	var cocktail_data_url = "cocktail-insights.json";
	
	return d3.json(cocktail_data_url)
	.then(data => {
		cocktail_data = data;
	});
}

function preprocessData(){
	recipe_index_map = parseIndexMap(cocktail_data.recipes, recipe => recipe.name);
	ingredient_index_map = parseIndexMap(cocktail_data.ingredients, ingredient => ingredient.name);
	top_alcoholic_ingredients = cocktail_data
		.ingredients.filter(ingredient => ingredient.abv > 0)
		.sort((a,b) => a.insights.recipe_usage.length < b.insights.recipe_usage.length ? 1 : -1)
		.map(ingredient => ingredient.name);
}

function parseIndexMap(arr, key_func){
	var result = {};
	for (var i = 0; i < arr.length; i++)
		result[key_func(arr[i])] = i;
	return result;
}

function layout(){
	fetchIBADataset()
	.then(preprocessData)
	.then(bubbleLayoutGraph);
}
