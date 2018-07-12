import {elements} from './base';

export const getInput = () => elements.searchInput.value; // to read input from our input form

export const clearInput = () => {
	elements.searchInput.value = '';
};

export const clearResults = () => {
	elements.searchResList.innerHTML= ''; // we deleted all the contents of class '.results__list'
	elements.searchResPage.innerHTML= ''; // we also remove the buttons for which parent class is '.results__pages'
};

export const highlightSelected = id => { // highlight the selected recipe on the left side
	const resultsArr = Array.from(document.querySelectorAll('.results__link'));   // we first select all of the results, 'querySelectorAll' gives a NodeList, we convert it to an array using 'from'
	resultsArr.forEach(el => {
		el.classList.remove('results__link--active'); // first, we remove that 'results__link--active' class from all the elements , then add that class to the required element
	});

	document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active'); // we select that href element inside of 'results__link' class in which hash is the id , then highlight that
};

export const limitRecipeTitle = (title, limit=17) => { // we want all the recipe titles in a single line
	   const newTitle = []; // we can add things to array , it is not mutating it
		if(title.length > limit){
			 title.split('').reduce((acc, cur) => { // splitting the title into its constituent words
			 	if(acc + cur.length <= limit){
			 		newTitle.push(cur);
			 	}
			 	return acc + cur.length; //the value we return will be the new accumulator

			 },0);
			//return the result
			 return `${newTitle.join('')}...`;   //'join()' opposite of split(), joins the elements of an array into a string separated by spaces
		}
		return title; // it is a good practice to leave 'else' when return is defined on both places
}

const renderRecipe = recipe => { //we will not export it, a private function, render this to UI
	const markup = `
	                <li>
                    <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="${recipe.title}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>
                `;
          elements.searchResList.insertAdjacentHTML('beforeend', markup); // we always want the new element to be put at the end of the list
};

// we will only create a markup, we just return a template string
// 'page' is the current page no, to show next and previous page number. 'type' for next or previous page button
// type: 'prev' or 'next'
const createButton = (page, type) => `
   <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page-1: page +1}>
     <span>Page ${type === 'prev' ? page-1: page +1}</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type === 'prev'? 'left' : 'right'}"></use>
                    </svg>
                    
                </button>
`; 
	

const renderButton= (page, numResults, resPerPage) => {  // 'numResults' and 'resPerPage' to determine no. of pages
	// to render button according to the current page number
	const pages = Math.ceil(numResults / resPerPage);  // 4.5 -> 5 to have more space to show all the results
	let button;
	if(page === 1 && pages > 1){ // we dont want the 'next page' button if there is only 1 page
		// Single Button to go to next page
	   button = createButton(page,'next'); // it will return
	}  

	else if(page < pages){  // if the current page no. is less than total no. of pages 
		//Both buttons
		button =`${createButton(page,'next')}
				 ${createButton(page,'prev')}
		`; 
	}

	else if(page === pages && pages > 1){ // if current page no. is equal to the no. of pages and  we dont want the 'previous page' button if there is only 1 page
		// Single Button to go to prev page
		button = createButton(page,'prev');
	}

	elements.searchResPage.insertAdjacentHTML('afterbegin', button)
};


export const renderResults = (recipes, page=1, resPerPage = 10) =>{
	// Render results of current page
	// we only want the no. of results = resPerPage not all of the 30 on a single page
	const start = [page - 1] * resPerPage;
	const end = page * resPerPage;  // after determining where to start and where to end we can call slice() method and end is not included in the array
	recipes.slice(start, end).forEach(renderRecipe); // el=> renderReceipe(el) , 'recipes' is an array of all the 30 elements , slice() is a zero-based 

	// Render pagination buttons
	renderButton(page, recipes.length, resPerPage);
}