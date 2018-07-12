// things which will be used across many modules
// it will contain an object that contains all of the elements that we select from DOM
export const elements = {  // named export
	searchForm: document.querySelector('.search'), // to select 'submit' from the Search FORM
	searchInput: document.querySelector('.search__field'),  // to get input value
	searchResList: document.querySelector('.results__list'),  // to get result list on the left side
	searchRes: document.querySelector('.results'),
	searchResPage: document.querySelector('.results__pages'),
	recipe: document.querySelector('.recipe'),
	shopping: document.querySelector('.shopping__list'),
	likesMenu: document.querySelector('.likes__field'),
	likesList: document.querySelector('.likes__list')
};

export const elementStrings = {
	loader: 'loader'
};

//adding a loader
export const renderLoader = parent => {
	const loader = `
		<div class="${elementStrings.loader}">
			<svg> 
			  <use href="img/icons.svg#icon-cw"></use>
			</svg>
		</div>
	`;
	parent.insertAdjacentHTML('afterbegin',loader); //and we have already defined CSS for 'loader' class
};

// to remove the loader after loading has finished
export const clearLoader = () => {
	const loader = document.querySelector(`.${elementStrings.loader}`);
	if(loader)	loader.parentElement.removeChild(loader);	// if there is a loader, then remove it
}