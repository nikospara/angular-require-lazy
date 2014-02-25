var
	fs = require("fs"),
	express = require("express"),
	app = express(),
	options = require("./build-scripts/options-grunt.js"),
	shared = require("./build-scripts/shared.js");

app.use(express.logger('dev'));
app.use(express.static(__dirname + '/build'));
app.use(express.static(__dirname + '/WebContent'));

// lazy registry
app.get("/scripts/lazy-registry.js", getLazyRegistry);

// API ////////////////////////////////////////////////////////////////////////
app.post("/api/user/login", express.bodyParser(), function(req, res) {
	//console.log(req.body); // works as expected
	res.json({id:1, defaultCategoryId:1, preferences:null});
});

app.get("/api/user/:id/categories", function(req, res) {
	console.log(req.route.params.id); // works as expected
	res.json({
		"payload": [
			{"key": 1, "name": "Other"},
			{"key": 2, "name": "Rent"},
			{"key": 3, "name": "Food"},
			{"key": 4, "name": "Entertainment"}
		]
	});
});
app.post("/api/user/:id/categories", singleStringBodyParser, function(req, res) {
//console.log(require("util").inspect(req));
//
// $.ajax("/api/user/1/categories",{dataType:"json",contentType:"application/json",type:"POST",data:"CatName"}).then(function(x){console.log(x);})
//
	///////////////////////////////////////////////////////////////////////////
//	res.json({
//		"payload": {"key": parseInt(Math.random()*1000+1000), "name": req.body}
//	});
	///////////////////////////////////////////////////////////////////////////
	setTimeout(function() { // simulate delay
		res.json({
			"payload": {"key": parseInt(Math.random()*1000+1000), "name": req.body}
		});
	}, 3000);
});
app["delete"]("/api/user/:id/categories/:key", express.bodyParser(), function(req, res) {
	setTimeout(function() { // simulate delay
		res.json({
			"payload": true
		});
	}, 3000);
});

app.post("/api/user/:userid/expenses", express.bodyParser(), function(req, res) {
	console.log(req.body);
	res.json({id:1});
});

app.get("/api/user/:id/expenses", function(req, res) {
	console.log(req.route.params.id + " - " + req.query.year + "/" + req.query.month); // works as expected
	res.json({
		"payload": [
			{key:1,  date:"2013-08-07T21:00:01.000Z", amount: 10, reason: "One",   categoryId: 1, special: null},
			{key:2,  date:"2013-08-08T21:00:02.000Z", amount: 12, reason: "Two",   categoryId: 1, special: null},
			{key:3,  date:"2013-08-08T21:00:03.000Z", amount: 14, reason: "Three", categoryId: 1, special: null},
			{key:4,  date:"2013-08-08T21:00:04.000Z", amount: 15, reason: "Four",  categoryId: 1, special: null},
			{key:5,  date:"2013-08-08T21:00:05.000Z", amount: 18, reason: "Five",  categoryId: 1, special: null},
			{key:11, date:"2013-08-08T21:00:11.000Z", amount: 10, reason: "One",   categoryId: 1, special: null},
			{key:12, date:"2013-08-08T21:00:12.000Z", amount: 12, reason: "Two",   categoryId: 1, special: null},
			{key:13, date:"2013-08-08T21:00:13.000Z", amount: 14, reason: "Three", categoryId: 1, special: null},
			{key:14, date:"2013-08-08T21:00:14.000Z", amount: 15, reason: "Four",  categoryId: 1, special: null},
			{key:15, date:"2013-08-08T21:00:15.000Z", amount: 18, reason: "Five",  categoryId: 1, special: null},
			{key:21, date:"2013-08-08T21:00:21.000Z", amount: 10, reason: "One",   categoryId: 1, special: null},
			{key:22, date:"2013-08-08T21:00:22.000Z", amount: 12, reason: "Two",   categoryId: 1, special: null},
			{key:23, date:"2013-08-08T21:00:23.000Z", amount: 14, reason: "Three", categoryId: 1, special: null},
			{key:24, date:"2013-08-08T21:00:24.000Z", amount: 15, reason: "Four",  categoryId: 1, special: null},
			{key:25, date:"2013-08-09T21:00:25.000Z", amount: 18, reason: "Five",  categoryId: 1, special: null}
		]
	});
});
///////////////////////////////////////////////////////////////////////////////

app.listen(8110);
console.log("Server running at http://localhost:8110 - get app.html or app-built.html");


function getLazyRegistry(req, res) {
	var modules, text, i, metadata, pmresult;
	
	modules = options.discoverModules();
	pmresult = makePmresult(modules);
	text = shared.createModulesRegistryText(pmresult, options, {
		inludeModuleName: false,
		generateBody: true,
		nullBundleDeps: true,
		writeBundleRegistrations: false
	});
	
	res.type("application/javascript");
	res.send(text);
	
	
	function makePmresult(modules) {
		var i, dummyParents = ["DUMMY"], pmresult = {
			modulesArray: []
		};
		
		for( i=0; i < modules.length; i++ ) {
			pmresult.modulesArray.push({
				name: modules[i],
				index: i,
				parents: dummyParents
			});
		}
		
		return pmresult;
	}
}

function singleStringBodyParser(req, res, next) {
	var buf = "";
	req.setEncoding("utf8");
	req.on("data", onData);
	req.on("end", onEnd);
	
	function onData(chunk) {
		buf += chunk;
	}
	
	function onEnd() {
		req.body = buf;
		next();
	}
}
