// Force-directed graph map of IBA official cocktails

var bubble_simulation = null;
var radius = 100;

// alcohol_colors = {'Gin':'red', 'Vodka':'blue', 'Whiskey':'yellow', 'White rum':'green', 'Triple Sec': 'orange', 'Tequila':'brown', 'Cognac':'violet'};
// alcohol_colors.hasOwnProperty(n.primary_alcohol) ? alcohol_colors[n.primary_alcohol] : 'lightblue'
var color = d3.scaleOrdinal(d3.schemePaired);

function bubble_layout_graph(){
	console.log(bubble_recipe_graph);
	var svg_handle = d3.select("#bubble-img");
	var width = parseInt(svg_handle.attr("width"));
	var height =  parseInt(svg_handle.attr("height"));
	
	bubble_simulation = d3.forceSimulation()
		.force("link", d3.forceLink().id(d => d.id))
		.force("center", d3.forceCenter(width / 2, height / 2));
		//.force("charge", d3.forceManyBody().strength(0.00001));

	// Set up the graph in D3
	var link = svg_handle.append("g")
		.attr("class", "links")
		.selectAll("line")
		.data(bubble_recipe_graph.links)
		.enter().append("line")
		.attr("stroke-width", l => l.value)
		.attr("visibility", "hidden");

	var node = svg_handle.append("g")
		.attr("class", "nodes")
		.selectAll("g")
		.data(bubble_recipe_graph.nodes)
		.enter().append("g");

	var circles = node.append("circle")
		.attr("r", n => n.type == "drink" ? radius * Math.sqrt(n.abv) : 25)
		.attr("fill", n => color(n.primary_alcohol))
		.attr("visibility", n => n.type == "drink" ? "visible" : "hidden");
		
		
	var clips = node.append("clipPath")
		.attr('id', n => "clipping-"+n.id.replace(/[\W_]+/g, '-'))
		.append("circle")
		.attr("r", n => n.type == "drink" ? radius * Math.sqrt(n.abv) : 25)
	var images = node.append("image")
		.attr('opacity', 0.3)
		.attr('href', "https://www.thecocktaildb.com/images/media/drink/rptuxy1472669372.jpg")
		.attr('x', n => n.type == "drink" ? -radius * Math.sqrt(n.abv) : -25)
		.attr('y', n => n.type == "drink" ? -radius * Math.sqrt(n.abv) : -25)
		.attr('height', n => n.type == "drink" ? 2*radius * Math.sqrt(n.abv) : 25)
		.attr('width', n => n.type == "drink" ? 2*radius * Math.sqrt(n.abv) : 25)
		.attr('clip-path', n => "url(#clipping-"+ n.id.replace(/[\W_]+/g, '-') +")")
		.attr("visibility", n => n.type == "drink" ? "visible" : "hidden");

	var node_text = svg_handle.append("g")
		.attr("class", "nodes")
		.selectAll("g")
		.data(bubble_recipe_graph.nodes)
		.enter().append("g");

	var lable_shadow = node_text.append("text")
		.text(n => n.id)
		.attr('text-anchor', "middle")
		.attr('style', "stroke: white; stroke-width: 4; stroke-linejoin : round; opacity: 0.9;")
		.attr("visibility", n => n.type == "drink" ? "visible" : "hidden");
	var lables = node_text.append("text")
		.text(n => n.id)
		.attr('text-anchor', "middle")
		.attr('style', "opacity: 1.0;")
		.attr("visibility", n => n.type == "drink" ? "visible" : "hidden");

	bubble_simulation
		.nodes(bubble_recipe_graph.nodes)
		.on("tick", ticked);

	bubble_simulation.force("link")
		.links(bubble_recipe_graph.links)
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
	
	bubble_simulation.force("collision", d3.forceCollide(n => n.type == "drink" ? radius * Math.sqrt(n.abv) : 0).iterations(1));
	
	
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
