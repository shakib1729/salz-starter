import uniqid from 'uniqid';


// DATA MODEL for right side List
export default class List {
	constructor(){ 
		  // 'items' is an array in which each of the element is an object having 'count', 'unit', 'ingredient'
		this.items= []; // we initially set 'items' array as empty , new items will be added to this array when we push them
	}

	addItem(count, unit, ingredient){
		const item = {  
			id: uniqid(), // we want each of the item to have an id, so that we can later identify what to update and what to delete
			count,
			unit,
			ingredient
		};

		this.items.push(item); // to push the created item to 'items' array
		return item;
	}

	deleteItem(id) {  // based on this id , we want to find the find the position of the item that matches this id    
        const index = this.items.findIndex(el => el.id === id);
		this.items.splice(index, 1); // we don't want to return anything
	}

	updateCount(id, newCount){
			this.items.find(el => el.id === id).count = newCount;   // we want to find the element itself. 'find' will return the item and then we set its 'count' as 'newCount'
	}
} 