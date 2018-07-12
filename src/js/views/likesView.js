import {elements} from './base';
import {limitRecipeTitle} from './searchView';

export const toggleLikeBtn = isLiked => {
	// img/icons.svg#icon-heart-outlined
	const iconString = isLiked ? 'icon-heart': 'icon-heart-outlined';
	document.querySelector('.recipe__love use').setAttribute('href',`img/icons.svg#${iconString}`);
								// 'use' is a child of '.recipe__love and we are setting it's 'href' attribute to this
};

export const toggleLikeMenu = numLikes => {  // to display the heart on top right corner only when the no. of likes is greater than 1
	elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

export const renderLike = like => {
  const markup = `
                <li>
                    <a class="likes__link" href="#${like.id}">
                        <figure class="likes__fig">
                            <img src="${like.img}" alt="${like.title}">
                        </figure>
                        <div class="likes__data">
                            <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                            <p class="likes__author">${like.author}</p>
                        </div>
                    </a>
                </li>
      `;
     elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {    // our special CSS selector where we can select based on 'href' attribute
	const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;    // we want to select all of the anchors(links) which have 'href' with this id in the 'likes__link' class
										// this selects the link but we don't want to remove just the links(class="likes__link"), we want to remove the entire 'li' element, so we select parentElement
	if(el){  // it's always good to check if the selection was successful
		el.parentElement.removeChild(el);
	}
};