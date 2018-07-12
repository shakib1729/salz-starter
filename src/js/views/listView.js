import {elements} from './base';

export const renderItem = item => {
	// As ususal we first create a 'markup' variable
	// "step" is with what amount we want to increase like 1->1.25->1.5, we define our 'count' also to be the step
	// we will need an id , so we add that like we had 'data-goto'
  const markup = `
     <li class="shopping__item" data-itemid=${item.id}>
                    <div class="shopping__count">
                        <input type="number" value="${item.count}" step="${item.id}" class="shopping__count-value">
                        <p>${item.unit}</p>
                    </div>
                    <p class="shopping__description">${item.ingredient}</p>
                    <button class="shopping__delete btn-tiny">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-cross"></use>
                        </svg>
                    </button>
            </li>

  `;	
  elements.shopping.insertAdjacentHTML('beforeend', markup);
};

export const deleteItem = id => {
    // we will use the 'data-itemid' property which we defined earlier
    // we can use CSS attribute selector using []
    const item = document.querySelector(`[data-itemid="${id}"]`);
    if(item)   item.parentElement.removeChild(item);
};