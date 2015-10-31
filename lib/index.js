var fs = require('fs');
var http = require('http');
var path = require('path');

var jqueryURL = 'http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js';
var angularURL = 'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js';

function downloadFile(url, dest, cb) {
	var file = fs.createWriteStream(dest);
	var request = http.get(url, function(response) {
		response.pipe(file);
		file.on('finish', function() {
		  file.close(cb);  // close() is async, call cb after close completes.
		});
	}).on('error', function(err) { // Handle errors
		fs.unlink(dest); // Delete the file async. (But we don't check the result)
		if (cb) cb(err.message);
	});
};

function moveFile(from, to) {
	if(arguments.length == 1){
		to = from;
		from = 'simpleHTML/index.html';
	} else {
		from = from ||  'simpleHTML/index.html';
		to = to || 'index.html';
	}

	var templatePath = 'templates/' + from;
	templatePath = path.normalize(templatePath);
	templatePath = path.resolve(__dirname, '..', templatePath);

	var resultFilePath = path.resolve(to);

	fs.createReadStream(templatePath).pipe(fs.createWriteStream(resultFilePath));
}

function createTemplate(templatePath, jquery, angular, cb) {
	if(templatePath != './') {
		fs.mkdirSync(templatePath);
	}
	var cssPath = templatePath + '/css/';
	var jsPath = templatePath + '/js/';
	var cssFile = 'style.css';
	var jqAngular = jquery && angular;

	// create path for css
	fs.mkdirSync(cssPath);
	// create path for js
	fs.mkdirSync(jsPath);

	// create style.css
	fs.writeFileSync(cssPath + cssFile, '', 'utf8');

	if(jqAngular) {
 		downloadFile(jqueryURL, jsPath + 'jquery.min.js', function(err) {
 			if (err) console.log(err);
 			else console.log('jQuery included');

			downloadFile(angularURL, jsPath + 'angular.min.js', function(err) {
				if (err) console.log(err);
				else console.log('Angular included');

				var basePath = 'jqAngular/';
				var jsFile = 'app.js';

				var htmlFrom = basePath + 'index.html';
				var htmlTo = templatePath + '/index.html';

				var jsFrom = basePath + jsFile;
				var jsTo = jsPath + jsFile;

		 		// create index.html
				moveFile(htmlFrom, htmlTo);

				// create app.js
				moveFile(jsFrom, jsTo);

				// run callback
	 	 		if(cb) cb();
			});
 		});
	}
	else if(angular) {
		downloadFile(angularURL, jsPath + 'angular.min.js', function(err) {
			if (err) console.log(err);
			else console.log('Angular included');

			var basePath = 'angular/';
			var jsFile = 'app.js';

			var htmlFrom = basePath + 'index.html';
			var htmlTo = templatePath + '/index.html';

			var jsFrom = basePath + jsFile;
			var jsTo = jsPath + jsFile;

			// create index.html
			moveFile(htmlFrom, htmlTo);

			// create app.js
			moveFile(jsFrom, jsTo);

			// run callback
 	 		if(cb) cb();
		});
	}

 	else if(jquery) {
 		downloadFile(jqueryURL, jsPath + 'jquery.min.js', function(err) {
 			if (err) console.log(err);
 			else console.log('jQuery included');

 			var basePath = 'jquery/';
			var jsFile = 'main.js';

			var htmlFrom = basePath + 'index.html';
			var htmlTo = templatePath + '/index.html';

			var jsFrom = basePath + jsFile;
			var jsTo = jsPath + jsFile;

	 		// create index.html
			moveFile(htmlFrom, htmlTo);

		 	// create main.js
			moveFile(jsFrom, jsTo);

			// run callback
 	 		if(cb) cb();
 		});
 	}
 	else {
 		var jsFile = 'main.js';

 		var htmlTo = templatePath + '/index.html';

 		// create index.html
		moveFile(htmlTo);

 	 	// create main.js
 	 	fs.writeFileSync(jsPath + jsFile, '', 'utf8');

 	 	// run callback
 	 	if(cb) cb();
 	}
}

exports.moveFile = moveFile;

exports.createTemplate = createTemplate;
