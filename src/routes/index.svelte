<script >
	import { onMount } from "svelte";
	import HomeViz from '/src/components/home_viz.svelte';
	import SearchBar from '/src/components/search_bar.svelte';
	import PreviewCard from '/src/components/preview_card.svelte';
	import {CocktailInsights} from '/src/stores'
	import {CurrentSearchTerm} from '/src/stores'
	import {parseIndexMap} from '/src/routes/app.js';

	let current_preview_item;
	let ingredients;

	var drinkDataSet;
	CurrentSearchTerm.subscribe((data) => swapPreview(data))
	CocktailInsights.subscribe((data) => drinkDataSet = data)

	let current_description;
	let item_name;
	let internal_path_name;
	let image_path;
	let list_ingredients;
	let special_ingredients;
	let instructions;
	let similar_drinks;
	let volume;


	onMount(async () => {
		 swapPreview(current_preview_item)
		 ingredients = drinkDataSet.filter(i => i.name)
	});

	 function swapPreview(preview_name){
		setTimeout(function(){
    		var recipe_index_map = parseIndexMap(drinkDataSet.recipes, recipe => recipe.name);
    		var drink = drinkDataSet.recipes[recipe_index_map[preview_name]];
    		item_name = drink.name
    		volume = drink.volume
    		list_ingredients = drink.ingredients
    		instructions = drink.preparation.split(".").filter(step => !!step)
    		special_ingredients = drink.special_ingredients
    		image_path = drink.image_url
    		similar_drinks = drink.insights.similar_recipes.slice(0,5)
		}, 300);
	}

	function changeCurrentItem(new_name){
		swapPreview(new_name)
	}

</script>


<svelte:head>
	<title>Cocktail Atlas</title>
	<meta name="description" content="Cocktail explorer" />
</svelte:head>

<div class="grid grid-cols-12 gap-3 px-4">
	<div class="col-span-12 w-full">
		<SearchBar/>
	</div>
	<div class="col-span-8">
		<HomeViz/>
	</div>
	<div class="col-span-4 h-full flex">
		<PreviewCard
				{item_name}
				{internal_path_name}
				{image_path}
				{list_ingredients}
				{instructions}
				{special_ingredients}
				{volume}
				{similar_drinks}
		/>
	</div>
</div>
