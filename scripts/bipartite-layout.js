// Force-directed graph map of IBA official cocktails

var simulation = null;

function bipartiteLayoutStyle(radial){
	if (radial){
		var svg_handle = d3.select("#bipartite-img");
		var width = parseInt(svg_handle.attr("width"));
		var height =  parseInt(svg_handle.attr("height"));
		simulation.force("radial", d3.forceRadial( n => n.type == "drink"? width/2 : width/10, width / 2, height / 2).strength(1.0));
	}
	else
		simulation.force("radial", null);
	simulation.alphaTarget(0.3).restart();
}

function bipartite_layout_graph(){
	//filterOnlyAlcohol();
	console.log(recipe_graph);
	var svg_handle = d3.select("#bipartite-img");
	var width = parseInt(svg_handle.attr("width"));
	var height =  parseInt(svg_handle.attr("height"));
	
	simulation = d3.forceSimulation()
		.force("link", d3.forceLink().id(d => d.id))
		.force("charge", d3.forceManyBody())
		.force("center", d3.forceCenter(width / 2, height / 2));
	//simulation.force("collision", d3.forceCollide(20));

	// Set up the graph in D3
	var link = svg_handle.append("g")
		.attr("class", "links")
		.selectAll("line")
		.data(recipe_graph.links)
		.enter().append("line")
		.attr("stroke-width", l => l.value * 10);

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


	// drag
	function dragstarted(d) {
		if (!d3.event.active) simulation.alphaTarget(0.3).restart();
		d.fx = d.x;
		d.fy = d.y;
	}
	function dragged(d) {
		d.fx = d3.event.x;
		d.fy = d3.event.y;
	}
	function dragended(d) {
		if (!d3.event.active) simulation.alphaTarget(0);
		d.fx = null;
		d.fy = null;
	}
	var drag_handler = d3.drag()
		.on("start", dragstarted)
		.on("drag", dragged)
		.on("end", dragended);
	drag_handler(node);
}
