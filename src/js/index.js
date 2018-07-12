import Search from './models/Search';
import * as searchView from './views/searchView'; // we will need everything
import * as recipeView from './views/recipeView'; // we will need everything
import * as listView from './views/listView'; // we will need everything
import * as likesView from './views/likesView'; // we will need everything
import {elements, renderLoader, clearLoader} from './views/base';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

// one object which is the state of our app

/** Global state of the app
 --All of this data wil be stored at all time in one central variable which we can access throughout our controller 
 - Search object--> search query and search result 
 - Current recipe object
 - Shopping list object
 - Liked recipes
**/
const state = {};
// testing
// const query = 'pizza';

// SEARCH CONTROLLER
const controlSearch = async () =>{
	// 1) Get query from searchView

	const query = searchView.getInput();
	

	// if there is a query, we want to create a new Search Object
	if(query){
		// 2) New search object and add that to state
			 state.search = new Search(query);  // we are creating a new instance of 'Search' class, const search = new Search('pizza');  we need to specify the 'query' whenever we create a new object based on 'Search' class


		// 3) Prepare UI for results (like showing loading spinner, clearing previous result)
			 searchView.clearInput(); // clear the input
			 searchView.clearResults(); // clear the SearchResList
			 renderLoader(elements.searchRes); // we send 'parent' where we want to add the loader, in this case  '.results' on the left side
        try{
        	// 4) Search for recipes
			 await state.search.getResults(); // getResults() is an async function in 'Search' class
			 // we wait for getResults() method to finish

		// 5) Render results on UI after we actually receive results from the API
			 clearLoader(); //remove the loader after getting data from API and before showing the results on the UI
			 searchView.renderResults(state.search.result); // result is an array, result is a property of 'Search' class, we pass this in renderResults() function where this array becomes 'recipe'

			} catch(error){
				alert('Something wrong with the search..');
				 clearLoader();
			}

		
	}
}

elements.searchForm.addEventListener('submit', e =>{
		e.preventDefault(); // we don't want to reload the page when we click the button
		controlSearch(); // whenever we submit in the Search FORM, run this function
});

// // TESTING automatically pizza is searched
// window.addEventListener('load', e =>{
// 		e.preventDefault(); // we don't want to reload the page when we click the button
// 		controlSearch(); // whenever we submit in the Search FORM, run this function
// });


elements.searchResPage.addEventListener('click', e=>{ //adding event listener when we click on 'page 1 or 2 or 3' below the Search Results
	const btn = e.target.closest('.btn-inline'); // we want to attach event handler to the whole button itself, not just to the text , icon ,etc
	  if(btn){
	  	const goToPage = parseInt(btn.dataset.goto, 10); // '10' is the base of the number. We can use 'dataset.goto' because in HTML we have 'data-goto'
	  	searchView.clearResults();
	  	 searchView.renderResults(state.search.result, goToPage); 
	 
	  }
});



// RECIPE CONTROLLER

const controlRecipe = async () => {
	//Get ID from url
	const id = window.location.hash.replace('#',''); // we get hash and remove the hash symbol

	if(id){
		// Prepare UI for changes
		recipeView.clearRecipe();
		 renderLoader(elements.recipe); // we need to pass the parent, so the loader knows where to display it

		// Highlight the selected search item
	  if(state.search)	searchView.highlightSelected(id);

		// Create new recipe object
		 state.recipe = new Recipe(id);

		 //TESTING so that we can access 'r' object directly in the browser(console)
		  //window.r = state.recipe;

        try{ // in case the promise is rejected
        // Get recipe data and parse ingredients
		await state.recipe.getRecipe(); // wait till we get data 
		state.recipe.parseIngredients();

		// Calculate servings and time
		state.recipe.calcTime();
		state.recipe.calcServings();

		//Render recipe
		clearLoader();
		recipeView.renderRecipe(state.recipe, state.likes.isLiked(id)); 

        } catch(error){
        	//console.log('Error processing data');
        }

	}

};


// window.addEventListener('hashchange', controlRecipe); //fired when 'hash' in the URL changes
// window.addEventListener('load',controlRecipe); // fired when the page loads

['hashchange', 'load'].forEach(event => window.addEventListener(event,controlRecipe)); // we saved the events in an array and then looped over them


// LIST CONTROLLER
 const controlList = () => {
 	// Create a new list, if there is none yet
 	if(!state.list) state.list = new List(); // if there is no list, then create a new list, we don't need to pass anything in the list

 	// Add each ingredient to the list and UI
 	state.recipe.ingredients.forEach(el => {  // 'ingredients' is an array, so we loop over it and for each element in 'ingredients' we add a new element to our 'list'
 	  const item = 	state.list.addItem(el.count, el.unit, el.ingredient); // el is currently one element of the ingredients , 'addItem' returns the newly created item
 	  listView.renderItem(item); // we pass in the newly created list item to render it to the UI
 	});
 }



 // Handle delete and update list item events
 elements.shopping.addEventListener('click', e=>{
// wherever we click on the UI(on the ListItem UI) whether we click on the number,name ,unit it will go to closest shopping item and then read the ID from that							    
 	const id = e.target.closest('.shopping__item').dataset.itemid; // we used 'data-itemid', so we can use 'dataset'

   // Handle the delete button
     if(e.target.matches('.shopping__delete, .shopping__delete *')){
     	// Delete from state
     	 state.list.deleteItem(id);
     	// Delete from UI
     	 listView.deleteItem(id);

     } else if(e.target.matches('.shopping__count-value')){ // Handle the update '+' & '-' , it does not have any children so we don't use *
     	 const val = parseFloat(e.target.value,10);     // since, now it is an 'input' element ,we can read its value property
     	 state.list.updateCount(id, val);
     }

 });

// LIKE CONTROLLER
const controlLike = () => {
	if(!state.likes) state.likes = new Likes(); // if no 'likes' then create a new 'likes'
					// here, we are creating a 'likes' state

	const currentID = state.recipe.id;

	if(!state.likes.isLiked(currentID)){  // if the current recipe is not already liked
		   // Add a new like to the state
		    const newLike = state.likes.addLike( // 'addLike' returns an object , the newly added 'like', so that we can later use that to 'renderLike'
		    	currentID, 
		    	state.recipe.title,
		    	state.recipe.author,
		    	state.recipe.img
		      );

		   // Toggle the like button
		   	likesView.toggleLikeBtn(true); // when the user has not liked the recipe and after he clciks the like button, it should then be liked

		   // Add like to UI list
		   likesView.renderLike(newLike);

	} else { // if the current recipe is already liked
		   // Remove like from the state
		    state.likes.deleteLike(currentID);

		   // Toggle the like button
	        likesView.toggleLikeBtn(false); // when the user has liked the recipe and again clicks on it, so dislike it

		   // Remove like from UI list
           likesView.deleteLike(currentID);
	}
	likesView.toggleLikeMenu(state.likes.getNumLikes());  // to display the heart on top right corner
};

// Restore likes recipes on the page load
window.addEventListener('load', () => {
	 state.likes = new Likes();

	 // Restore likes
	 state.likes.readStorage();


	 // Toggle like menu button
	 likesView.toggleLikeMenu(state.likes.getNumLikes()); // to display the heart on top right corner

	 // Render the existing likes
	 state.likes.likes.forEach(like => likesView.renderLike(like));

});


// we use event delegation, because '+' and '-' are not present initially
// Handling recipe button clicks 
// it handles all the event that happens inside the recipe object
elements.recipe.addEventListener('click', e =>{

	if(e.target.matches('.btn-decrease, .btn-decrease *'))  {  // if target matches button decrease or any child element of button decrease
		// Decrease button is clicked
		if(state.recipe.servings > 1){  // only decrease if servings is greater than 1
		state.recipe.updateServings('dec');		// in this function , we update 'recipe.servings'	and 'count' (no. of ingredients)
		recipeView.updateServingsIngredients(state.recipe); // here, we update the new servings and new no. of ingredients to the UI 
		               //for each 'ingredient' object we have 'count, unit, ingredient'				 	
				 	
		}
   } else if(e.target.matches('.btn-increase, .btn-increase *'))  {  // if target matches button increase or any child element(even if the click happens on the font,svg,empty space) of button increase
		// Increase button is clicked
		state.recipe.updateServings('inc');
		recipeView.updateServingsIngredients(state.recipe);

   } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {   // to add new items to the shopping list // if target matches button add or any child element of button add
   		  controlList();
   } else if(e.target.matches('.recipe__love, .recipe__love *')){  // when 'like'(heart) button is clicked
   		// Like Controller
   		 controlLike();
   }

});