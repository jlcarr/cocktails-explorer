// Force-directed graph map of IBA official cocktails

var recipe_data = null;
var ingredient_data = null;

var recipe_graph = null;
var bubble_recipe_graph = null;

function fetchIBADataset(){
	var recipe_data_url = "https://raw.githubusercontent.com/teijo/iba-cocktails/master/recipes.json";
	var ingredient_data_url = "https://raw.githubusercontent.com/teijo/iba-cocktails/master/ingredients.json";


	var recipe_promise = d3.json(recipe_data_url)
	.then(data => {
		recipe_data = data;
	});
	var ingredient_promise = d3.json(ingredient_data_url)
	.then(data => {
		ingredient_data = data;
	});

	return Promise.allSettled([recipe_promise, ingredient_promise]);
}

function preprocessData(){
	// process volume
	recipe_data.forEach(drink => {
		drink.volume = drink.ingredients.reduce( (acc, ingredient) =>
			acc + (ingredient.amount > 0 ? ingredient.amount : 0)
		, 0)
	});
	
	// process total alcohol
	recipe_data.forEach(drink => {
		drink.alcohol = drink.ingredients.reduce( (acc, ingredient) =>
			acc + (ingredient.amount > 0 ? ingredient.amount * ingredient_data[ingredient.ingredient].abv / 100 : 0)
		, 0)
	});
	
	// primary alcohol
	recipe_data.forEach(drink => {
		drink.primary_alcohol = drink.ingredients
			.filter(item => item.amount > 0)
			.sort((a,b) => a.amount * ingredient_data[a.ingredient].abv < b.amount * ingredient_data[b.ingredient].abv ? 1 : -1)[0].ingredient
	});

	parseRecipeGraph();
	
	bubble_recipe_graph = JSON.parse(JSON.stringify(recipe_graph));
	//filterOnlyAlcohol();
}

function parseRecipeGraph(){
	recipe_graph = {
		// Extract the drinks and ingredients, remove undefined special items, then sort for de-duping
		nodes: recipe_data.flatMap(drink =>
			[{id:drink.name, type: 'drink', abv: drink.alcohol / drink.volume, primary_alcohol: drink.primary_alcohol}].concat(
				drink.ingredients.map(ingredient =>
					({id: ingredient.ingredient, type: 'ingredient'})
		)))
			.filter(item => item.id !== undefined)
			.sort((a,b) => a.id < b.id ? -1 : 1)
			.filter((item, pos, arr) => !pos || item.id != arr[pos - 1].id),
		// Extract the links from drinks to ingredients with amounts as the weight.
		links: recipe_data.flatMap(drink =>
			drink.ingredients.flatMap(ingredient =>
				({source: drink.name, target: ingredient.ingredient, value: ingredient.amount / drink.volume})
		))
			.filter(item => item.source !== undefined && item.target !== undefined)
	}
}

function filterOnlyAlcohol(){
	recipe_graph.nodes = recipe_graph.nodes.filter(item => item.type != 'ingredient' || ingredient_data[item.id].abv > 0);
	recipe_graph.links = recipe_graph.links.filter(item => ingredient_data[item.target].abv > 0);
}

function layout(){
	fetchIBADataset()
	.then(preprocessData)
	.then(bipartite_layout_graph)
	.then(bubble_layout_graph);
}
