define(function() {
/* 
 * Sammy.js, PubSub-based router for jSignature project home page.
 *  
 * Note, this is a AMD(async module definition)-based application block. 
 *   
 * This is a double-wrap: we return function pointer that is ran against
 * depends in loader, that, in-turn returns an application isntance, that,
 * in-turn is ran in document.on("ready" as appinstance.Run()
 */
return function($, templating) {
	'use strict'
	
	var namespace = 'jSignatureHome'
	
	$.subscribe(
		namespace + "_about"
		, function(){
			$('article').each(function(){ 
				if (this.id !== 'article_about') {
					$(this).hide()                	
                }
			})
		}
	)
	
	// All of the class definition code expects that DOM IS NOT LOADED YET.
	// everything is done through predefined closures and callbacks that WILL
	// fire when app instance is finally ran.
	var RouterClass = function($, namespace) {
		this.APP_NAME = "jSignature Home Page"
		    
		var app = this 
		
		// This code sets up Sammy.js application. It is inited at the very end.
		app.sammyapp = $.sammy(function() {
		    this.raise_errors = true
		    this.debug = true
		    this.run_interval_every = 300
		    this.template_engine = null
		    this.element_selector = '#main_content'
		})
		
		// ROUTES Have to be defined from complex to simple. Otherwise the shortest match will pick it up first.
		
		app.sammyapp.route('get',/\#\/PageNotFound/, function() {
			document.title = "404 - Page not found"
		    this.notFound()
		})
		app.sammyapp.route('get',/\#\//, function() {
			document.title = "About jSignature"
		    $.publish(namespace + "_about")
		})
		app.sammyapp.route('get','', function() {
			this.app.setLocation("#/")
		})
		app.sammyapp.route('get',/(.*)/, function() {
			this.app.setLocation("#/PageNotFound")
		})
		
		// ----------------------------------------------------------------------
		
		app.setLocation = function(location){
			app.sammyapp.setLocation(newpath)
		}
		
		//------------------------------------------------------------------------
		// !!! This is what parent code will pull when it's time for us to run !!!
		//------------------------------------------------------------------------
		app.Run = function() {
		    this.sammyapp.run()
		    console.log(this.APP_NAME + " is running")
		}
	}
	
	// 2. returning class's instance
	return new RouterClass($, namespace) // notice that this is INITED app, but not started 
	// .Run will be pulled by parent code when it is appropriate
		
} // return function
}) // define