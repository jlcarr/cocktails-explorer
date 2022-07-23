<script>
    import { onMount } from "svelte";
    import { fade } from 'svelte/transition';
    import {CurrentSearchTerm} from '../stores'

    export let item_name;
    export let internal_path_name
    export let image_path
    export let list_ingredients = []
    export let special_ingredients = []
    export let instructions = []
    export let volume;
    export let similar_drinks = []

	let preview_name

	function handleRecommendedItemClick(e){
	    CurrentSearchTerm.update(val => e.path[0].id)
	}

</script>
<!--	    -->

<div transition:fade class="max-w-md w-96 px-6 pb-4 mx-auto mt-16 bg-white rounded-lg shadow-lg dark:bg-gray-800 ">
    <div class="flex -mt-16 md:justify-end">
        <img alt="selected_item" class="object-cover w-20 h-20 border-2 border-blue-500 rounded-full dark:border-blue-400" src={image_path}>
    </div>

    <h2 class="mt-2 mb-3 font-semibold text-gray-800 dark:text-white md:mt-0">{item_name}</h2>
    <div class="break-words">
    <div style="height:50px;overflow-y:auto">
    <small>Similar to...</small>
    {#each similar_drinks as similar_drink}
    <button on:click={handleRecommendedItemClick}><span id="{similar_drink.name}" class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
        {similar_drink.name} (~ {Math.round((similar_drink.similarity * 100) / 100 * 100)}% similar)
    </span></button>
    {/each}
    </div>
    </div>

    <p class="mt-2 w-full p-4 pl-0 rounded-lg text-gray-600 dark:text-gray-200"></p>

    <div class="max-h-80 border-y-2 py-2 overflow-auto">
    <div>
        <ul class="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            {#each list_ingredients as ingredient}
            <li class="w-full truncate px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                <div class="flex">
                <img class="flex-none w-6 h-full" src="https://www.thecocktaildb.com/images/ingredients/{ingredient.name}-small.png"/>
                <span class="ml-2 truncate">
                    {ingredient.amount} of {ingredient.name}
                </span>
                </div>
            </li>
            {/each}
            {#each special_ingredients as special_ingredient}
            <li class="w-full truncate px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                <div class="flex">
                    <span class="ml-2 truncate">
                    {special_ingredient}
                </span>
                </div>
            </li>
            {/each}
        </ul>
    </div>

    <div>
        <ul class="list-decimal list-inside mt-3">
            {#each instructions as step}
            <li class="">
                {step}
            </li>
            {/each}
        </ul>
    </div>
    </div>


<!--Button-->
<!--<div class="flex justify-center mt-4">-->
<!--    <a href="recipes/internal" class="flex items-center justify-center w-full px-2 py-1 text-white transition-colors duration-200 transform bg-blue-600 rounded-md focus:outline-none sm:w-auto sm:mx-1 hover:bg-blue-500 focus:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-40">-->
<!--        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">-->
<!--            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />-->
<!--            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />-->
<!--        </svg>-->
<!--        <span class="mx-1">-->
<!--                Explore-->
<!--            </span>-->
<!--    </a>-->
<!--</div>-->

</div>