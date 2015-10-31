#!/usr/bin/env node
var readline = require('readline');
var lib = require('./lib');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var args = process.argv.slice(2);
var start = new Date().getTime();

var templatePath = args[0] || './';

console.log('Hello! :)');
console.log('This is a simple project maker. We just need to know what to include.');
console.log('*** HINT ***: type y to confirm or just press enter for skip.');

rl.question("Do you want to include jQuery? ", function(jquery) {

	rl.question("Do you want to include Angular.js? ", function(angular) {

		lib.createTemplate(templatePath, jquery, angular, function() {
			var end = new Date().getTime();
			var time = end - start;
			console.log('Done');
			console.log('Execution time: ' + time + ' ms ('+ time / 1000 +' sec)');

			rl.close();
		});

	});

});
