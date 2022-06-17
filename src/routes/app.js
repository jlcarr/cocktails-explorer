function convertNameToUID(name){
  	// remove white spaces replace with '-' for a smexy url
  	name = name.replace(/\s/g, "-");
  	return name.toLowerCase()
  }

  function convertDataIngredientsToArrayWith(object){
  	// converts the returned drink data from the API into 2 arrays. First being the ordered ingredients the second
  	// being the ingredients with the needed qty. To be passed in to the preview card to build how-to.

  	var ingredients = Object.keys(object)
  		.filter(key => key.includes("Ingredient"))
  		.filter(key => !!object[key])
  		.map(ingredient_key => object[ingredient_key]);

  	var filtered_measures = Object.keys(object)
  		.filter(key => key.includes("Measure"))
  		.filter(key => !!object[key])
  		.map(measure => object[measure]);

  	var how_to = []
  	ingredients.forEach(function (value, i) {
		if(filtered_measures[i]){
			how_to.push(filtered_measures[i] + " of " + value)
		}
		else{
			how_to.push(value)
		}
		});
	return [ingredients, how_to]
  }


 export  async function getPreviewData(name) {
      var current_preview_item = {}
      let response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?" + new URLSearchParams({s: name}))
      var data =  await response.json()
        var drink = data.drinks[0]
        console.log(drink)
        current_preview_item.image_path = drink.strDrinkThumb
        current_preview_item.current_description = ""
        current_preview_item.item_name = name
        current_preview_item.internal_path_name = convertNameToUID(name)
        current_preview_item.array_ingredients = convertDataIngredientsToArrayWith(drink)
        if (drink.strTags){
            current_preview_item.array_tags = drink.strTags.split(',')
        }
        else {
            current_preview_item.array_tags = []
        }

        current_preview_item.is_visible = true
        return current_preview_item
  }