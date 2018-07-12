import axios from 'axios'; // axios does good error handling , automatically returns json, supported by all browsers
import {key, proxy} from '../config'; 

export default class Recipe{
	constructor(id){  // each Recipe will have a unique ID
		this.id = id;
	}

	async getRecipe(){
		try{
			const res = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`); // here, we use the 'get' route
			this.title = res.data.recipe.title;
			this.author = res.data.recipe.publisher;
			this.img = res.data.recipe.image_url;
			this.url = res.data.recipe.source_url;
			this.ingredients = res.data.recipe.ingredients; // an Array
			
		} catch(error){
			console.log(error);
			alert('Something went wrong :(');
		}
	}

	calcTime(){
		// Assuming that we need 15 min for each 3 ingredients
		const numIng = this.ingredients.length;
		const periods = Math.ceil(numIng/3);
		this.time = periods*15;
	}

	calcServings(){
		this.servings = 4;
	}

	parseIngredients(){  // to standardize all the units and remove that is is parenthesis
		                   // first plurals, then sigulars to remove extra s
		const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds']; // we will check each ingredients if they contain unitsLong , if they contain then replace them by unitsShort
		const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz','tsp','tsp','cup','pound'];
		const units = [...unitsShort, 'kg', 'g'];  //to include these also

		const newIngredients = this.ingredients.map(el => {

			let ingredient = el.toLowerCase();

			// 1) Uniform units
				unitsLong.forEach((unit, i) => {
					ingredient = ingredient.replace(unit, unitsShort[i]);
				});



			// 2) Remove parenthesis
				ingredient = ingredient.replace(/ *\([^)]*\) */g, ' '); // a regular expression, to match different situations in a string
			// 3) Parse ingredients into count, unit and ingredient 
				const arrIng = ingredient.split(' '); // so now , when there will be a space it will now split and each word will become a new element of the array
				const unitIndex = arrIng.findIndex(el2 => units.includes(el2)); // 'includes' returns true if the element that we are passing in(el2) is in the array(unitsShort)

				let objIng;
				if(unitIndex > -1){ // if 'findIndex' doesn't find , it returns -1
					// There is a unit
				    
												// excluding index of unit, Eg: 4 1/2 cups , arrCount is [4,1/2] 
												//							Eg: 4 cups, arrCount is [4]
				const arrCount = arrIng.slice(0, unitIndex); // we will assume that everything that comes before a unit will be a new number
				let count;

				 if(arrCount.length === 1){       // Eg: 1-1/2 cups, 2-3 tsp salt
				 	count = eval(arrIng[0].replace('-','+')); // if only one number , then the first element is the quantity
				 } else {
				 	count = eval(arrIng.slice(0,unitIndex).join('+'));  // --> eval(" 4+ 1/2")--> 4.5 // join will create a string
				 }

				 objIng = {
				 	count,
				 	unit: arrIng[unitIndex],
				 	ingredient: arrIng.slice(unitIndex +1).join(' ') // ingredients is the entire array except arrIng[0] which is a number
				 };	


				} else if (parseInt(arrIng[0],10)){ // if the conversion is successfull , it will be true and if the conversion is unsuccessfull, it will return NaN which will be coerced to false
					// There is No unit but first element is a number

				 objIng = {
				 	count: parseInt(arrIng[0],10), // the first element in the array is the quantity
				 	unit: '',
				 	ingredient: arrIng.slice(1).join(' ') // ingredients is the entire array except arrIng[0] which is a number
				 }					

				}
				else if(unitIndex === -1){
					// There is NO unit and NO number in 1st position

				 objIng = {
				 	count: 1,
				 	unit: '',
				 	ingredient // ingredient: ingredient
				 }
				}
																					 // 'findIndex' returns index where this test turns out to be 'true'

			return objIng;
		});
		this.ingredients = newIngredients;
	}

	updateServings (type){
		// Servings

		const newServing = type === 'dec' ? this.servings -1 : this.servings + 1; //it will not update 'this.serving' 
		console.log(this.servings);
		// Ingredients
		 this.ingredients.forEach(ing => {
		 	ing.count *= (newServing / this.servings); // eg: for 4 servings, 3 cup butter , so for 6 servings, (3/4)*6 = 3*(6/4) = 4.5 cup butter
		 });

		this.servings = newServing;

	}
}