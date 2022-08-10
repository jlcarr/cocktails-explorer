import {writable} from 'svelte/store'
import {cocktailInsights} from './temp_data.js';


export const CurrentSearchTerm = writable("Tuxedo")

export const CocktailInsights = writable(cocktailInsights)