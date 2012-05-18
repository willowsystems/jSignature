/* 
 * Sammy.js, PubSub-based router for jSignature project home page.
 *  
 * Note, this is a AMD(async module definition)-based application block. 
 *   
 * This is a double-wrap: we return function pointer that is ran against
 * depends in loader, that, in-turn returns an application isntance, that,
 * in-turn is ran in document.on("ready" as appinstance.Run()
 * 
 * Copyright 2012 Willow Systems Corporation (willow-systems.com)
 */
define(
['jquery']
, function($) {
return function($) {
	'use strict'
	
	var namespace = 'jSignatureHome'
	, dynamicAppSelector = '#frontstage'
		
	// All of the class definition code expects that DOM IS NOT LOADED YET.
	// everything is done through predefined closures and callbacks that WILL
	// fire when app instance is finally ran.
	var RouterClass = function($, namespace) {
		var APP_NAME = this.APP_NAME = "jSignature Home Page"
		    
		var app = this 
		
		// This code sets up Sammy.js application. It is inited at the very end.
		app.sammyapp = $.sammy(function() {
		    this.raise_errors = false
		    this.debug = false
		    this.run_interval_every = 300
		    this.template_engine = null
		    this.element_selector = dynamicAppSelector
		    // this.use('GoogleAnalytics')
		})

		function deriveRequireablePath(context, path){

			var pathParts = path.split("/")
			, hashArguments = pathParts.pop()
			, hashFolder = pathParts.join('/')
			, mainjsPath = hashFolder + '/' + 'main'
			, urlPrefix = String(window.location.href).split(window.location.hash)[0]

			context.pathURI = urlPrefix
			context.pathFolder = hashFolder
			context.pathArguments = hashArguments

			require([urlPrefix + mainjsPath])
			.then(
				function(resource){
					resource.call(context)
				}
				, function(resource){
					// context.app.swap("404 - Not Found")
					document.title = "404 - Not Found"
					context.app.notFound()
				}
			)
		}
		
		// ROUTES Have to be defined from complex to simple. Otherwise the shortest match will pick it up first.
		app.sammyapp.route('get', /#\/$/, function() {
			this.app.setLocation("#/about/")
		})
		app.sammyapp.route('get', /#\/about\/$/, function() {
			this.app.swap(
				$('#defaultviewholder').html()
			)
		})
		app.sammyapp.route('get', /#\/(.*)/, function() {
			document.title = APP_NAME
			deriveRequireablePath(this, this.params.splat[0])
		})
		
		// ----------------------------------------------------------------------
		
		//------------------------------------------------------------------------
		// !!! This is what parent code will pull when it's time for us to run !!!
		//------------------------------------------------------------------------
		app.Run = function() {
		    this.sammyapp.run('#/about/')
		    console.log(this.APP_NAME + " is running")
		}
	}

	$(dynamicAppSelector).on('click.sammy_front_runner', 'a', function(e){
		var $t = $(e.currentTarget)
		, encodedHash = $t.attr('href')
		
		// if encodedHash starts with "#.." indicating start of relative hash
		if (encodedHash.substr(0, 3) === '#..'){
			var resolvedURL = $t.prop('href').split(encodedHash)
			// if there is nothing trailing the relative hash fragment in resolved URL
			if (resolvedURL.length === 2 && resolvedURL[1] === ''){
				var newHashParts = window.location.hash.split('/')
				// regardless of if the end was "/" (resulting in last string of "") or "file.ext", it's not a name of "dir". Dropping.
				newHashParts.pop()
				// chopping off "#" and splitting the dirs in new relative hash
				var encodedHashParts = encodedHash.substr(1, encodedHash.length).split('/')
				, section
				while(encodedHashParts.length){
				    section = encodedHashParts.shift()
				    if (section === "..") {
				        if (newHashParts.length > 1 /* we are keeping '#' in place */) {newHashParts.pop()}
				    }
				    else if (section === ".") {}
				    else {newHashParts.push(section)}
				}
				var newHash = newHashParts.join('/')
				$t.attr('href', newHash)
				$t.prop('href', resolvedURL[0] + newHash)
			} 
		}
		return true;
	})

	// 2. returning class's instance
	return new RouterClass($, namespace) // notice that this is INITED app, but not started 
	// .Run will be pulled by parent code when it is appropriate
		
} // return function
}) // define