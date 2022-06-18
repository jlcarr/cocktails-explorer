<script>
import Ingredient from './ingredient_item.svelte';
import {CurrentSearchTerm} from '../stores'

let searchInput;

// placeholder as ingredeints but will swap to drinks? not sure what best way to filter here is.
let ingredients = ['Vesper', 'Bacardi', 'Negroni', 'Rose', 'Old Fashioned', 'Tuxedo', 'Mojito', "Horse's Neck", "Planter's Punch", 'Sea Breeze', 'Pisco Sour', 'Long Island Iced Tea', 'Clover Club', 'Angel Face', 'Mimosa', 'Whiskey Sour', 'Screwdriver', 'Cuba Libre', 'Manhattan', 'Porto Flip', 'Gin Fizz', 'Espresso Martini', 'Margarita', 'French 75', 'Yellow Bird', 'Pina Colada', 'Aviation', 'Bellini', 'Grasshopper', 'Tequila Sunrise', 'Daiquiri', 'Rusty Nail', 'B52', 'Stinger', 'Golden Dream', 'God Mother', 'Spritz Veneziano', 'Bramble', 'Alexander', 'Lemon Drop Martini', 'French Martini', 'Black Russian', 'Bloody Mary', 'Mai-tai', 'Barracuda', 'Sex on the Beach', 'Monkey Gland', 'Derby', 'Sidecar', 'Irish Coffee', 'Sazerac', 'Americano', 'Singapore Sling', 'French Connection', 'Moscow Mule', 'John Collins', 'Kir', 'Mint Julep', "Tommy's Margarita", 'Paradise', 'Dirty Martini', 'Champagne Cocktail', 'Mary Pickford', 'Hemingway Special', "Dark 'n' Stormy", 'Ramos Fizz', 'Russian Spring Punch', 'God Father', 'Cosmopolitan', 'Dry Martini', 'Between the Sheets', 'Casino', 'Caipirinha', 'Vampiro', 'Kamikaze', 'White Lady', 'Harvey Wallbanger']

let filteredIngredients = [];

const filterIngredients = () => {
	let storageArr = []
	if (inputValue) {
		ingredients.forEach(ingredient => {
			 if (ingredient.toLowerCase().includes(inputValue.toLowerCase())) {
				 storageArr = [...storageArr, makeMatchBold(ingredient)];
			 }
		});
	}
	filteredIngredients = storageArr;
}

let inputValue = "";

$: if (!inputValue) {
	filteredIngredients = [];
	hiLiteIndex = null;
}

const clearInput = () => {
	inputValue = "";
	searchInput.focus();
}

const setInputVal = (ingredientName) => {
	inputValue = removeBold(ingredientName);
	filteredIngredients = [];
	hiLiteIndex = null;
	document.querySelector('#ingredient-input').focus();
}

const searchedValue = () => {
	if (inputValue) {
		console.log(`${inputValue} is submitted!`);
		CurrentSearchTerm.update(n => inputValue)
		setTimeout(clearInput, 500);
	} else {
		alert("You didn't type anything.")
	}
}

const makeMatchBold = (str) => {
	let makeBold = `<strong>${str}</strong>`;
	let boldedMatch = str.replace(str, makeBold);
	return boldedMatch;
}

const removeBold = (str) => {
	//replace < and > all characters between
	return str.replace(/<(.)*?>/g, "");
}


let hiLiteIndex = null;
//$: console.log(hiLiteIndex);
$: hiLitedIngredient = filteredIngredients[hiLiteIndex];

const navigateList = (e) => {
	if (e.key === "ArrowDown" && hiLiteIndex <= filteredIngredients.length-1) {
		hiLiteIndex === null ? hiLiteIndex = 0 : hiLiteIndex += 1
	} else if (e.key === "ArrowUp" && hiLiteIndex !== null) {
		hiLiteIndex === 0 ? hiLiteIndex = filteredIngredients.length-1 : hiLiteIndex -= 1
	} else if (e.key === "Enter") {
		setInputVal(filteredIngredients[hiLiteIndex]);
	} else {
		return;
	}
}
</script>


<svelte:window on:keydown={navigateList} />

<form autocomplete="off" on:submit|preventDefault={searchedValue}>
    <div class="autocomplete">
        <input id="ingredient-input"
               class="p-4 w-full text-sm rounded-lg border ring-blue-500 border-blue-500"
               type="text"
               placeholder="Search for a drink"
               bind:this={searchInput}
               bind:value={inputValue}
               on:input={filterIngredients}>
        <button type="submit" class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
    </div>
    {#if filteredIngredients.length > 0}
    <ul class="bg-white border border-gray-200 rounded-lg" id="autocomplete-items-list">
        {#each filteredIngredients as ingredient, i}
        <Ingredient itemLabel={ingredient} highlighted={i === hiLiteIndex} on:click={() => setInputVal(ingredient)} />
        {/each}
    </ul>
    {/if}
</form>


<style>
div.autocomplete {
  /*the container must be positioned relative:*/
  position: relative;
	width: 100%;
}

#autocomplete-items-list {
	position: relative;
	margin: 0;
	padding: 0;
	top: 0;
	width: 100%;
}
</style>