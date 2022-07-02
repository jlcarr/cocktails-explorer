import {writable} from 'svelte/store'
import {dummy_data} from './temp_data.js';
import {cocktailInsights} from './temp_data.js';


export const CurrentSearchTerm = writable("Tuxedo")

export const CurrentGraph = writable(dummy_data)

export const CocktailInsights = writable(cocktailInsights)