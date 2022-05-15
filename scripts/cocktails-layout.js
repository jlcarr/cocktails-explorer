// Force-directed graph map of IBA official cocktails

var data_url = "https://raw.githubusercontent.com/teijo/iba-cocktails/master/recipes.json";


function layout(){
	var svg_handle = d3.select("svg");
	var width = parseInt(svg_handle.attr("width"));
	var height =  parseInt(svg_handle.attr("height"));
	
	var simulation = d3.forceSimulation()
		.force("link", d3.forceLink().id(d => d.id))
		.force("charge", d3.forceManyBody())
		.force("center", d3.forceCenter(width / 2, height / 2));
	
	d3.json(data_url, (err, dataset) => {
		if (err) throw err;
	
		// Parse the graph in the correct format
		var graph = parseIBADataset(dataset);

		// Set up the graph in D3
		var link = svg_handle.append("g")
			.attr("class", "links")
			.selectAll("line")
			.data(graph.links)
			.enter().append("line")
			.attr("stroke-width", l => Math.sqrt(l.value));

		console.log(graph);
		var node = svg_handle.append("g")
			.attr("class", "nodes")
			.selectAll("g")
			.data(graph.nodes)
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
			.nodes(graph.nodes)
			.on("tick", ticked);

		simulation.force("link")
			.links(graph.links);

		function ticked() {
			link
				.attr("x1", l => l.source.x)
				.attr("y1", l => l.source.y)
				.attr("x2", l => l.target.x)
				.attr("y2", l => l.target.y);
			node
				.attr("transform", n => "translate("+ n.x + "," + n.y + ")");
		}

	});
}

function parseIBADataset(data){
	var result = {
		// Extract the drinks and ingredients, remove undefined special items, then sort for de-duping
		nodes: data.flatMap(drink => 
			[{id:drink.name, type: 'drink'}].concat(
				drink.ingredients.map(ingredient => 
					({id: ingredient.ingredient, type: 'ingredient'})
		)))
			.filter(item => item.id !== undefined)
			.sort((a,b) => a.id < b.id ? -1 : 1)
			.filter((item, pos, arr) => !pos || item.id != arr[pos - 1].id),
		// Extract the links from drinks to ingredients with amounts as the weight.
		links: data.flatMap(drink => 
			drink.ingredients.flatMap(ingredient =>
				({source: drink.name, target: ingredient.ingredient, value: ingredient.amount})
		))
			.filter(item => item.source !== undefined && item.target !== undefined)
	}
	return result;
}
