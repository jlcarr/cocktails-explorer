<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    var recipe_data = null;
    var ingredient_data = null;
    var recipe_graph = null;

    var simulation = null;
    let svg;
    onMount(() => {
		layout();

	})

     function layout(){
        fetchIBADataset()
        .then(layout_graph);
    }


    function layoutStyle(radial){
        if (radial){
            var svg_handle = d3.select(svg);
            var width = parseInt(svg_handle.attr("width"));
            var height =  parseInt(svg_handle.attr("height"));
            simulation.force("radial", d3.forceRadial( n => n.type == "drink"? 500 : 100, width / 2, height / 2).strength(1.0));
        }
        else
            simulation.force("radial", null);
        simulation.alphaTarget(0.3).restart();
    }

    function layout_graph(){
        filterOnlyAlcohol();
        var svg_handle = d3.select(svg);
        svg_handle.attr("height", "80vh")
        svg_handle.attr("align","center");

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
            .attr("stroke-width", l => l.value/2)
            .style('stroke', '#999')
            .style('stroke-opacity', '0.6')

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
            if (!d.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }
        function dragended(d) {
            if (!d.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
        var drag_handler = d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
        drag_handler(node);
    }

    function fetchIBADataset(){
        var recipe_data_url = "https://raw.githubusercontent.com/teijo/iba-cocktails/master/recipes.json";
        var ingredient_data_url = "https://raw.githubusercontent.com/teijo/iba-cocktails/master/ingredients.json";


        var recipe_promise = d3.json(recipe_data_url)
        .then(data => {
            recipe_data = data;
            parseRecipeGraph();
        });
        var ingredient_promise = d3.json(ingredient_data_url)
        .then(data => {
            ingredient_data = data;
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

</script>
<svg >

</svg>
<main>

    <div style="width:100%;height:100%;">
<!--        <svg align="center" preserveAspectRatio="xMidYMid" viewBox='-50 -50 125 125' bind:this={svg} height="100%" width="100%" id="main-img"></svg>-->
        <br>
    </div>

</main>

<style>
	main {
		height: 100%;
	}


	circle {
		fill: black;
		fill-opacity: 0.5;
	}
	.links line {
	stroke: #999;
	stroke-opacity: 0.6;
}

</style>