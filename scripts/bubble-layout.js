// Force-directed graph map of IBA official cocktails

var bubble_simulation = null;
var radius = 200;

alcohol_colors = {'Gin':'red', 'Vodka':'blue', 'Whiskey':'yellow', 'White rum':'green', 'Triple Sec': 'orange', 'Tequila':'brown', 'Cognac':'violet'};

function bubble_layout_graph(){
	console.log(bubble_recipe_graph);
	var svg_handle = d3.select("#bubble-img");
	var width = parseInt(svg_handle.attr("width"));
	var height =  parseInt(svg_handle.attr("height"));
	
	bubble_simulation = d3.forceSimulation()
		.force("link", d3.forceLink().id(d => d.id))
		.force("center", d3.forceCenter(width / 2, height / 2))
		.force("collision", d3.forceCollide(n => n.type == "drink" ? radius * n.abv : 0));

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
		.attr("r", n => n.type == "drink" ? radius * n.abv : 0)
		.attr("fill", n => alcohol_colors.hasOwnProperty(n.primary_alcohol) ? alcohol_colors[n.primary_alcohol] : 'lightblue')
		.attr("visibility", n => n.type == "drink" ? "visible" : "hidden");


	var lables = node.append("text")
		.text(n => n.type == "drink" ? n.id: "")
		.attr('text-anchor', "middle");

	node.append("title")
		.text(n => n.id);

	bubble_simulation
		.nodes(bubble_recipe_graph.nodes)
		.on("tick", ticked);

	bubble_simulation.force("link")
		.links(bubble_recipe_graph.links)
		.strength(l => l.value);

	function ticked() {
		link
			.attr("x1", l => l.source.x)
			.attr("y1", l => l.source.y)
			.attr("x2", l => l.target.x)
			.attr("y2", l => l.target.y);
		node
			.attr("transform", n => "translate("+ n.x + "," + n.y + ")");
	}


	// drag
	function dragstarted(d) {
		if (!d3.event.active) bubble_simulation.alphaTarget(0.3).restart();
		d.fx = d.x;
		d.fy = d.y;
	}
	function dragged(d) {
		d.fx = d3.event.x;
		d.fy = d3.event.y;
	}
	function dragended(d) {
		if (!d3.event.active) bubble_simulation.alphaTarget(0);
		d.fx = null;
		d.fy = null;
	}
	var drag_handler = d3.drag()
		.on("start", dragstarted)
		.on("drag", dragged)
		.on("end", dragended);
	drag_handler(node);
}
