import axios from 'axios'; // axios does good error handling , automatically returns json, supported by all browsers
import {key, proxy} from '../config'; 

// data model for search using ES6 classes
// the query and search result only

export default class Search{
	constructor(query){
		this.query = query;
	}

  async getResults(){ // async method of this class, we don't use 'function' keyword

      try{
    	  const res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`); // we use the 'search' route, it will do a AJAX call and will return a promise just like fetch and we don't need to convert the json ,it automatically returns json
    	  this.result = res.data.recipes;
    	  // console.log(this.result);
      }
      catch(error){
      	alert(error);
      }
 }
}
