<script >
	import {CurrentSearchTerm} from '/src/stores'
	import { onMount } from "svelte";
	import HomeViz from '/src/components/home_viz.svelte';
	import SearchBar from '/src/components/search_bar.svelte';
	import PreviewCard from '/src/components/preview_card.svelte';
	import {getPreviewData} from '/src/routes/app.js';
	let current_preview_item;
	let ingredients = ['Vesper', 'Bacardi', 'Negroni', 'Rose', 'Old Fashioned', 'Tuxedo', 'Mojito', "Horse's Neck", "Planter's Punch", 'Sea Breeze', 'Pisco Sour', 'Long Island Iced Tea', 'Clover Club', 'Angel Face', 'Mimosa', 'Whiskey Sour', 'Screwdriver', 'Cuba Libre', 'Manhattan', 'Porto Flip', 'Gin Fizz', 'Espresso Martini', 'Margarita', 'French 75', 'Yellow Bird', 'Pina Colada', 'Aviation', 'Bellini', 'Grasshopper', 'Tequila Sunrise', 'Daiquiri', 'Rusty Nail', 'B52', 'Stinger', 'Golden Dream', 'God Mother', 'Spritz Veneziano', 'Bramble', 'Alexander', 'Lemon Drop Martini', 'French Martini', 'Black Russian', 'Bloody Mary', 'Mai-tai', 'Barracuda', 'Sex on the Beach', 'Monkey Gland', 'Derby', 'Sidecar', 'Irish Coffee', 'Sazerac', 'Americano', 'Singapore Sling', 'French Connection', 'Moscow Mule', 'John Collins', 'Kir', 'Mint Julep', "Tommy's Margarita", 'Paradise', 'Dirty Martini', 'Champagne Cocktail', 'Mary Pickford', 'Hemingway Special', "Dark 'n' Stormy", 'Ramos Fizz', 'Russian Spring Punch', 'God Father', 'Cosmopolitan', 'Dry Martini', 'Between the Sheets', 'Casino', 'Caipirinha', 'Vampiro', 'Kamikaze', 'White Lady', 'Harvey Wallbanger']

	CurrentSearchTerm.subscribe((data) => swapPreview(data))

	let current_description;
	let item_name;
	let internal_path_name;
	let image_path;
	let is_visible = true
	let list_ingredients;
	let tags;


	onMount(async () => {
		 swapPreview(current_preview_item)
	});

	function swapPreview(preview_name){
	  console.log(preview_name)
	  getPreviewData(preview_name).then(function(data){
		image_path = data.image_path
		current_description = data.current_description
		item_name = data.item_name
		internal_path_name = data.internal_path_name
		list_ingredients = data.array_ingredients
		tags = data.array_tags
		is_visible = data.is_visible
		})
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
	<div class="bg-blue-100 col-span-8">
<!--		<HomeViz/>-->
	</div>
	<div class="col-span-4 h-full flex">
		<PreviewCard
				current_description={current_description}
				item_name={item_name}
				inernal_path_name={internal_path_name}
				image_path={image_path}
				list_ingredients={list_ingredients}
				tags={tags}
		/>
	</div>
</div>
