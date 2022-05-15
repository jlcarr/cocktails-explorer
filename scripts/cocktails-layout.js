// Force-directed graph map of IBA official cocktails

var recipe_data = null;
var ingredient_data = null;
var recipe_graph = null;


function layout(){
	fetchIBADataset()
	.then(layout_graph);
}

function layout_graph(){
	filterOnlyAlcohol();
	console.log(recipe_graph);
	var svg_handle = d3.select("svg");
	var width = parseInt(svg_handle.attr("width"));
	var height =  parseInt(svg_handle.attr("height"));
	
	var simulation = d3.forceSimulation()
		.force("link", d3.forceLink().id(d => d.id))
		.force("charge", d3.forceManyBody())
		.force("center", d3.forceCenter(width / 2, height / 2));
	
	// Set up the graph in D3
	var link = svg_handle.append("g")
		.attr("class", "links")
		.selectAll("line")
		.data(recipe_graph.links)
		.enter().append("line")
		.attr("stroke-width", l => l.value/2);

	var node = svg_handle.append("g")
		.attr("class", "nodes")
		.selectAll("g")
		.data(recipe_graph.nodes)
		.enter().append("g");

	var circles = node.append("circle")
		.attr("r", 5)
		.attr("fill", n => n.type == "drink" ? "blue": "orange");


	var lables = node.append("text")
		.text(n => n.id)
		.attr('x', 6)
		.attr('y', 3);

	node.append("title")
		.text(n => n.id);

	simulation
		.nodes(recipe_graph.nodes)
		.on("tick", ticked);

	simulation.force("link")
		.links(recipe_graph.links);

	function ticked() {
		link
			.attr("x1", l => l.source.x)
			.attr("y1", l => l.source.y)
			.attr("x2", l => l.target.x)
			.attr("y2", l => l.target.y);
		node
			.attr("transform", n => "translate("+ n.x + "," + n.y + ")");
	}

}

function fetchIBADataset(){
	var recipe_data_url = "https://raw.githubusercontent.com/teijo/iba-cocktails/master/recipes.json";
	var ingredient_data_url = "https://raw.githubusercontent.com/teijo/iba-cocktails/master/ingredients.json";


	var recipe_promise = d3.json(recipe_data_url)
	.then(data => {
		recipe_data = data;
		parseRecipeGraph();
		console.log(recipe_data);
		console.log(recipe_graph);
	});
	var ingredient_promise = d3.json(ingredient_data_url)
	.then(data => {
		ingredient_data = data;
		console.log(ingredient_data);
	});

	return Promise.allSettled([recipe_promise, ingredient_promise]);
}

function parseRecipeGraph(){
	recipe_graph = {
		// Extract the drinks and ingredients, remove undefined special items, then sort for de-duping
		nodes: recipe_data.flatMap(drink => 
			[{id:drink.name, type: 'drink'}].concat(
				drink.ingredients.map(ingredient => 
					({id: ingredient.ingredient, type: 'ingredient'})
		)))
			.filter(item => item.id !== undefined)
			.sort((a,b) => a.id < b.id ? -1 : 1)
			.filter((item, pos, arr) => !pos || item.id != arr[pos - 1].id),
		// Extract the links from drinks to ingredients with amounts as the weight.
		links: recipe_data.flatMap(drink => 
			drink.ingredients.flatMap(ingredient =>
				({source: drink.name, target: ingredient.ingredient, value: ingredient.amount})
		))
			.filter(item => item.source !== undefined && item.target !== undefined)
	}
}

function filterOnlyAlcohol(){
	recipe_graph.nodes = recipe_graph.nodes.filter(item => item.type != 'ingredient' || ingredient_data[item.id].abv > 0);
	recipe_graph.links = recipe_graph.links.filter(item => ingredient_data[item.target].abv > 0);
}
