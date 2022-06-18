<script>
	import { page } from '$app/stores';
	import logo from './cocktail_explorer.png';
</script>

<header class="h-5 mb-8">
    <nav class="bg-white shadow dark:bg-gray-800">
        <div class="container px-6 mx-auto md:flex md:justify-between md:items-center">
            <div class="flex items-center justify-between">
                <div>
                    <a href="/">
                        <img style="margin-right:5px;" width="40px" alt="JC Github" src="{logo}" class="text-xl font-bold text-gray-800 dark:text-white hover:text-gray-700 dark:hover:text-gray-300">
                    </a>
                </div>
                <div>
                    <a class="font-bold text-gray-800 transition-colors duration-200 transform dark:text-white hover:text-gray-700 dark:hover:text-gray-300" href="/">CocktailAtlas</a>
                </div>
            </div>
        </div>
    </nav>
</header>
