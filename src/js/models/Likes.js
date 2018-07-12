// similar to List class, instead of saving the ingredients we are going to save the likes
// 'Likes' model
// here we want to implement localStorage

// when we change the 'likes' array, then at that time we should save it into the localStorage
export default class Likes {
	constructor(){
		this.likes = [];
	}

	addLike(id, title, author, img){  // we need to save this data in each individual likes
		const like = { id, title, author, img}; // an object
		this.likes.push(like);

		// Persist data in localStorage
		this.persistData();

		return like;
	  }

	 deleteLike(id){  // here we pass in the id , then we find the index of that id and then remove the element
	 	const index = this.likes.findIndex(el => el.id === id);
		this.likes.splice(index, 1); // we don't want to return anything

		// Persist data in localStorage
		this.persistData();

	 }

	 isLiked(id){ //to test if we have a like in our 'likes' array for the id that we pass in
	 	return this.likes.findIndex(el => el.id === id) !== -1; // if this is not -1 , that means that is already present so it returns 'true', if the item is not present then it returns 'false'
	 						// it returns 'true' if the 'id' that we pass in is already present in the 'likes' array
	 }

	 getNumLikes(){  
	 	return this.likes.length;
	 }

	 persistData() {              // we have single 'Likes' key in which  we store all of our likes
	 	  localStorage.setItem('likes', JSON.stringify(this.likes));   // we can only save string, so we have to 'stringify' the array using JSON and later when using it we can convert it back to an array 
	 }

	 readStorage(){
	 	const storage = JSON.parse(localStorage.getItem('likes')); // it will return NULL if it does not have the key that we are looking for

	 	// Restore likes from the localStorage
	 	if(storage) this.likes = storage;
	 }

}