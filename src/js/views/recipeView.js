import {elements} from './base';
import {Fraction} from 'fractional'; // for fraction.js

export const clearRecipe = () => {
	elements.recipe.innerHTML = '';
}


// for number like 0.33333333333 the Fraction() function cannot deal with that
const formatCount = count =>{  // to format the numbers count =2.5 --> 2 1/2
    if(count){ // it might sometime may be 'undefined'
    		// count =2.5 --> 5/2 --> 2 1/2
    	    // count =0.5 --> 1/2
    	  var newCount = Math.round(count * 100)/ 100;
    	  const [int, dec] = newCount.toString().split('.').map(el => parseInt(el,10)); // split gives a string, we convert it to an int so now both 'int' an 'dec' are an integer
        
        if(!dec) return newCount; // if there is no decimal

        if(int == 0){ //eg: newCount =0.5 --> 1/2
        	const fr = new Fraction(newCount);
        	return `${fr.numerator}/${fr.denominator}`;
        } else {
        	const fr = new Fraction(newCount - int); // we only want fraction of decimal part
        	return `${int} ${fr.numerator}/${fr.denominator}`;

        }


    }
   return '1';
};


// it will return this string and there we convert it back to string 
const createIngredient = ingredient => ` 
              <li class="recipe__item">
                  <svg class="recipe__icon">
                        <use href="img/icons.svg#icon-check"></use>
                    </svg>
                    <div class="recipe__count">${formatCount(ingredient.count)}</div>
                    <div class="recipe__ingredient">
                        <span class="recipe__unit">${ingredient.unit}</span>
                        ${ingredient.ingredient}
                    </div>
                </li> 

`;


// here, map function will return an array in which each of the elements is the markup for one of the ingredients but we need a string inside of an HTML element , so we join it
export const renderRecipe = (recipe, isLiked) => {
	const markup = `
				      <figure class="recipe__fig">
	                <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
	                <h1 class="recipe__title">
	                    <span>${recipe.title}</span>
	                </h1>
	            </figure>
	            <div class="recipe__details">
	                <div class="recipe__info">
	                    <svg class="recipe__info-icon">
	                        <use href="img/icons.svg#icon-stopwatch"></use>
	                    </svg>
	                    <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
	                    <span class="recipe__info-text"> minutes</span>
	                </div>
	                <div class="recipe__info">
	                    <svg class="recipe__info-icon">
	                        <use href="img/icons.svg#icon-man"></use>
	                    </svg>
	                    <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
	                    <span class="recipe__info-text"> servings</span>

	                    <div class="recipe__info-buttons">
	                        <button class="btn-tiny btn-decrease">
	                            <svg>
	                                <use href="img/icons.svg#icon-circle-with-minus"></use>
	                            </svg>
	                        </button>
	                        <button class="btn-tiny btn-increase">
	                            <svg>
	                                <use href="img/icons.svg#icon-circle-with-plus"></use>
	                            </svg>
	                        </button>
	                    </div>

	                </div>
	                <button class="recipe__love">
	                    <svg class="header__likes">
	                        <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
	                    </svg>
	                </button>
	            </div>



	            <div class="recipe__ingredients">
	                <ul class="recipe__ingredient-list">
	                 ${recipe.ingredients.map(el => createIngredient(el)).join('')}

	                </ul>

	                <button class="btn-small recipe__btn recipe__btn--add">
	                    <svg class="search__icon">
	                        <use href="img/icons.svg#icon-shopping-cart"></use>
	                    </svg>
	                    <span>Add to shopping list</span>
	                </button>
	            </div>

	            <div class="recipe__directions">
	                <h2 class="heading-2">How to cook it</h2>
	                <p class="recipe__directions-text">
	                    This recipe was carefully designed and tested by
	                    <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
	                </p>
	                <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
	                    <span>Directions</span>
	                    <svg class="search__icon">
	                        <use href="img/icons.svg#icon-triangle-right"></use>
	                    </svg>

	                </a>
	            </div>	 
	`;

	elements.recipe.insertAdjacentHTML('afterbegin', markup);
};


export const updateServingsIngredients = recipe => {
	
	// Update serving
	document.querySelector('.recipe__info-data--people').textContent = recipe.servings;


	// Update ingredients
	const countElements = Array.from(document.querySelectorAll('.recipe__count'));  // we select the 'count' (no. of ingredients) array
	 countElements.forEach((el, i) => {   // we replace the no. of ingredient with the newly calculated ingredient (from different array) at the same position using index 'i'
	 		el.textContent = formatCount(recipe.ingredients[i].count); // we are looping over two arrays at the same time
	 });

};