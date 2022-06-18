// Force-directed graph map of IBA official cocktails

var bubble_graph = null;
var bubble_simulation = null;

var bubble_colors = d3.scaleOrdinal(d3.schemePaired);
var radius = 100;

var ingredients_visibility = "hidden";


function parseRecipeGraph(){
	bubble_graph = {
		// Extract the drinks and ingredients
		nodes: cocktail_data.recipes.map(recipe =>
			({
				id: recipe.name,
				type: 'drink',
				img_url: recipe.image_url,
				abv: recipe.insights.abv,
				primary_alcohol: recipe.insights.primary_alcohol
			})
		).concat(cocktail_data.ingredients.map(ingredient =>
			({
				id: ingredient.name,
				type: 'ingredient',
				img_url: ingredient.image_url
			})
		)),
		// Extract the links from drinks to ingredients with amounts as the weight.
		links: cocktail_data.recipes.flatMap(recipe =>
			recipe.ingredients.map(ingredient =>
				({
					source: recipe.name,
					target: ingredient.name,
					value: ingredient.amount
				})
			)
		)
	};
}


function bubbleLayoutGraph(){
	parseRecipeGraph();
	console.log(bubble_graph);
	top_alcoholic_ingredients.forEach(ingredient => bubble_colors(ingredient));
	
	// Set up the graph in D3
	var svg_handle = d3.select("#bubble-img");
	var width = parseInt(svg_handle.attr("width"));
	var height =  parseInt(svg_handle.attr("height"));

	var link = svg_handle.append("g")
		.attr("class", "links")
		.selectAll("line")
		.data(bubble_graph.links)
		.enter().append("line")
		.attr("stroke-width", l => l.value)
		.attr("visibility", "hidden");

	var node = svg_handle.append("g")
		.attr("class", "nodes")
		.selectAll("g")
		.data(bubble_graph.nodes)
		.enter().append("g")
		.attr("opacity", 1.0)
		//.on("mouseover", mouseover)
		//.on("mouseout", mouseout);

	var circles = node.append("circle")
		.attr("r", n => n.type == "drink" ? radius * Math.sqrt(n.abv) : 25)
		.attr("fill", n => bubble_colors(n.primary_alcohol))
		.attr("visibility", n => n.type == "drink" ? "visible" : ingredients_visibility);
		
		
	var clips = node.append("clipPath")
		.attr('id', n => "clipping-"+n.id.replace(/[\W_]+/g, ''))
		.append("circle")
		.attr("r", n => n.type == "drink" ? radius * Math.sqrt(n.abv) : 25)
	var images = node.append("image")
		.attr('opacity', 0.3)
		.attr('href', n => n.img_url)
		.attr('x', n => n.type == "drink" ? -radius * Math.sqrt(n.abv) : -25)
		.attr('y', n => n.type == "drink" ? -radius * Math.sqrt(n.abv) : -25)
		.attr('height', n => n.type == "drink" ? 2*radius * Math.sqrt(n.abv) : 50)
		.attr('width', n => n.type == "drink" ? 2*radius * Math.sqrt(n.abv) : 50)
		.attr('clip-path', n => "url(#clipping-"+ n.id.replace(/[\W_]+/g, '') +")")
		.attr("visibility", n => n.type == "drink" ? "visible" : ingredients_visibility);

	var node_text = svg_handle.append("g")
		.attr("class", "nodes-text")
		.selectAll("g")
		.data(bubble_graph.nodes)
		.enter().append("g")
		.attr("opacity", 1.0)
		//.on("mouseover", mouseover)
		//.on("mouseout", mouseout);

	var lable_shadow = node_text.append("text")
		.text(n => n.id)
		.attr('text-anchor', "middle")
		.attr('style', "stroke: white; stroke-width: 4; stroke-linejoin : round; opacity: 0.9;")
		.attr("visibility", n => n.type == "drink" ? "visible" : ingredients_visibility);
	var lables = node_text.append("text")
		.text(n => n.id)
		.attr('text-anchor', "middle")
		//.attr('style', "opacity: 1.0;")
		.attr("visibility", n => n.type == "drink" ? "visible" : ingredients_visibility);

	function mouseover(d,i){
		similarityOpacity(d.id);
	}
	function mouseout(d,i){
		resetOpacity();
	}


	// Set up simulation
	bubble_simulation = d3.forceSimulation()
		.force("link", d3.forceLink().id(d => d.id))
		.force("collision", d3.forceCollide(n => n.type == "drink" ? radius * Math.sqrt(n.abv) : 0).iterations(1))
		.force("center", d3.forceCenter(width / 2, height / 2))
		.force("gravity", d3.forceManyBody().strength(1));

	bubble_simulation
		.nodes(bubble_graph.nodes)
		.on("tick", ticked);
	bubble_simulation.force("link")
		.links(bubble_graph.links)
		.strength(l => l.value); // + (l.source.primary_alchol == l.target.id)

	function ticked() {
		link
			.attr("x1", l => l.source.x)
			.attr("y1", l => l.source.y)
			.attr("x2", l => l.target.x)
			.attr("y2", l => l.target.y);
		node
			.attr("transform", n => "translate("+ n.x + "," + n.y + ")");
		node_text
			.attr("transform", n => "translate("+ n.x + "," + n.y + ")");
	}
	
	
	bubble_simulation.on('end', () => {
		bubble_simulation.on('end',null);
		console.log('First simulation done');
		
		bubble_simulation.force("collision", d3.forceCollide(n => n.type == "drink" ? 1+radius * Math.sqrt(n.abv) : 0).iterations(2));
		
		//bubble_simulation.force("charge", d3.forceManyBody().strength(30));
		//bubble_simulation.force("center", null);
		
		/*
		bubble_recipe_graph.nodes.forEach(n => {
			n.x = Math.max(0, Math.min(width, n.x));
			n.y = Math.max(0, Math.min(height, n.y));
		});
		*/
		
		bubble_simulation.alpha(0.3).restart();
		//console.log(bubble_simulation.alpha())
		
		bubble_simulation.on('end', () => {
			bubble_simulation.on('end',null);
			bubble_simulation.alpha(0.3).restart();
		});
	});

}


function similarityOpacity(recipe_name){
	var recipe = cocktail_data.recipes[recipe_index_map[recipe_name]];
	var recipe_similarity_map = {};
	recipe_similarity_map[recipe_name] = 1.0;
	recipe.insights.similar_recipes.forEach( other_recipe => {
		recipe_similarity_map[other_recipe.name] = other_recipe.similarity;
	});
	
	d3.select("g.nodes")
		.selectAll("g")
		//.transition()
		//.duration(500)
		.attr("opacity", n => !!recipe_similarity_map[n.id] ? recipe_similarity_map[n.id] : 0);
	d3.select("g.nodes-text")
		.selectAll("g")
		//.transition()
		//.duration(500)
		.attr("opacity", n => !!recipe_similarity_map[n.id] ? recipe_similarity_map[n.id] : 0);
}

function resetOpacity(){
	d3.select("g.nodes")
		.selectAll("g")
		//.transition()
		//.duration(500)
		.attr("opacity", 1.0);
	d3.select("g.nodes-text")
		.selectAll("g")
		//.transition()
		//.duration(500)
		.attr("opacity", 1.0);
}
