const path = require('path'); // to use 'path' we include a built-in node package
const HtmlWebpackPlugin = require('html-webpack-plugin'); // to use plugins

module.exports = { //the entire configuration is an object
	entry: ['babel-polyfill', './src/js/index.js'], // we pass multiple entry points in an array
	output: {
		path: path.resolve(__dirname, 'dist'), //__dirname is current absolue path and we join this with where we want our bundle.js to be in
		filename: 'js/bundle.js'
	},
	devServer: {
		contentBase: './dist' // specify the folder from where webpack should serve the file , in 'dist' folder we have final code that we will ship to the client(css,img,js), 'src' for development purpose
	},
	plugins: [  //plugins receive an array
		new HtmlWebpackPlugin({  // we pass the options as object (common pattern in JS)
			// we want to copy our source index.html from 'src' to 'dist' each time when we are bundling
			 filename: 'index.html',
			 template: './src/index.html', // our starting html file
		})
	],
	module: {
		rules: [ // an array of all of the loaders we want to use
		 { // for each loader, we need an object
		 	test: /\.js$/,  // regular expression   // will look all file and look if they end with .js  and if it is a .js file,then it will apply babel-loader loader to it  //for each loader we need 'test' property
		 	exclude: /node_modules/,   // if we dont' do this , babel will apply to all files in node_modules
		 	use: {
		 		loader: 'babel-loader' // we also need babel config file //but there are things which we cant simply convert because they were not previously present in ES5, they were new features(like promises), these need to be polyfilled
		 	}
		 }

	  ]
	}
};