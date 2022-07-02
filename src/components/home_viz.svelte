<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import {CurrentGraph} from '../stores'
    import {CurrentSearchTerm} from '../stores'
    import {CocktailInsights} from '../stores'
    import {parseIndexMap} from '/src/routes/app.js';


    var cocktail_data;
    var recipe_index_map = null;

    export let graph_links = []
    export let graph_nodes = []

    let el;

    var bubble_simulation = null;
    var radius = 100;

    // alcohol_colors = {'Gin':'red', 'Vodka':'blue', 'Whiskey':'yellow', 'White rum':'green', 'Triple Sec': 'orange', 'Tequila':'brown', 'Cognac':'violet'};
    // alcohol_colors.hasOwnProperty(n.primary_alcohol) ? alcohol_colors[n.primary_alcohol] : 'lightblue'
    var color = d3.scaleOrdinal(d3.schemePaired);

    function similarityOpacity(recipe_name){
        var recipe = cocktail_data.recipes[recipe_index_map[recipe_name]];
        var recipe_similarity_map = {};
        recipe_similarity_map[recipe_name] = 1.0;
        recipe.insights.similar_recipes.forEach( other_recipe => {
            recipe_similarity_map[other_recipe.name] = other_recipe.similarity;
        });

        d3.select("g.nodes")
            .selectAll("g")
            .attr("opacity", n => !!recipe_similarity_map[n.id] ? recipe_similarity_map[n.id] : .10);
        d3.select("g.nodes-text")
            .selectAll("g")
            .attr("opacity", n => !!recipe_similarity_map[n.id] ? recipe_similarity_map[n.id] : 0);
    }

    function resetOpacity(){
        d3.select("g.nodes")
            .selectAll("g")
            .attr("opacity", 1.0);
        d3.select("g.nodes-text")
            .selectAll("g")
            .attr("opacity", 1.0);
    }

    function imageClickfromSVG(e){CurrentSearchTerm.update(n => e.id)}

    function setPointer(e){
        d3.select(el).style("cursor", 'pointer');
        similarityOpacity(e.id)
    }

     function setRegular(e, type){
        d3.select(el).style("cursor", 'default');
        resetOpacity()
    }

    function bubble_layout_graph(){
        var svg_handle = d3.select(el)

        var width = '600'
        var height =  '600'

        bubble_simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(d => d.id))
            .force("center", d3.forceCenter(width / 2, height / 2));

        // Set up the graph in D3
        var link = svg_handle.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph_links)
            .enter().append("line")
            .attr("stroke-width", l => l.value)
            .attr("visibility", "hidden");

        var node = svg_handle.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(graph_nodes)
            .enter()
            .append("g")
            .on("click", imageClickfromSVG)
            .on("mouseover", function(d){setPointer(d)})
            .on("mouseout", function(d){setRegular(d)})


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
            .attr("class", "nodes-text")
            .selectAll("g")
            .data(graph_nodes)
            .enter().append("g")
            .on("click", imageClickfromSVG)
            .on("mouseover", function(d){setPointer(d)})
            .on("mouseout", function(d){setRegular(d)})

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
            .nodes(graph_nodes)
            .on("tick", ticked);

        bubble_simulation.force("link")
            .links(graph_links)
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

            /*
            graph_nodes.forEach(n => {
                n.x = Math.max(0, Math.min(width, n.x));
                n.y = Math.max(0, Math.min(height, n.y));
            });
            */

            bubble_simulation.alpha(0.3).restart();

            bubble_simulation.on('end', () => {
                bubble_simulation.on('end',null);
                bubble_simulation.alpha(0.3).restart();
            });
        });

    }

    function setGraph(data){
        graph_links = data.links
        graph_nodes = data.nodes
        bubble_layout_graph()
    }

    onMount(async () => {
		 CurrentGraph.subscribe((data) => setGraph(data))
		 CocktailInsights.subscribe((data) => cocktail_data = data)
		 recipe_index_map = parseIndexMap(cocktail_data.recipes, recipe => recipe.name);
	});


</script>
<main>
    <svg class="bubbles" width="100%" height="80vh" bind:this={el}></svg>
</main>
