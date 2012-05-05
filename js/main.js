;(function($){
	"use strict"

	/*  @preserve
	jQuery pub/sub plugin 
	2012 (c) ddotsenko@willowsystems.com
	based on Peter Higgins (dante@dojotoolkit.org)
	Loosely based on Dojo publish/subscribe API, limited in scope. Rewritten blindly.
	Original is (c) Dojo Foundation 2004-2010. Released under either AFL or new BSD, see:
	http://dojofoundation.org/license for more information.
	*/
	;(function($) {
		var topics = {};
		/**
		 * Allows caller to emit an event and pass arguments to event listeners.
		 * @public
		 * @function
		 * @param topic {String} Name of the channel on which to voice this event
		 * @param **arguments Any number of arguments you want to pass to the listeners of this event.
		 */
		$.publish = function(topic, arg1, arg2, etc) {
			if (topics[topic]) {
				var currentTopic = topics[topic]
				, args = Array.prototype.slice.call(arguments, 1)
				
				for (var i = 0, j = currentTopic.length; i < j; i++) {
				    currentTopic[i].apply($, args);
				}
			}
		};
		/**
		 * Allows listener code to subscribe to channel and be called when data is available 
		 * @public
		 * @function
		 * @param topic {String} Name of the channel on which to voice this event
		 * @param callback {Function} Executable (function pointer) that will be ran when event is voiced on this channel.
		 * @returns {Object} A token object that cen be used for unsubscribing.  
		 */
		$.subscribe = function(topic, callback) {
			if (!topics[topic]) {
			    topics[topic] = [callback];
			} else {
				topics[topic].push(callback);		    
			}
			return {
			    "topic": topic,
			    "callback": callback
			};
		};
		/**
		 * Allows listener code to unsubscribe from a channel 
		 * @public
		 * @function
		 * @param token {Object} A token object that was returned by `subscribe` method 
		 */
		$.unsubscribe = function(token) {
			if (topics[token.topic]) {
				var currentTopic = topics[token.topic];
				
				for (var i = 0, j = currentTopic.length; i < j; i++) {
				    if (currentTopic[i] === token.callback) {
				        currentTopic.splice(i, 1);
				    }
				}
			}
		};
	})($);
	// end of PubSub plugin
	
	define(
		'jquery'
		,function(){return $}
	)

	var pathtojsignature
	if (location.host === 'localhost') {
		pathtojsignature ='js!js/libs/jSignature.min.js'
	} else {
		pathtojsignature = 'js!' + location.protocol + '//raw.github.com/willowsystems/jSignature/stable/jSignature.min.js'
    }
	
 	define(
 		'requirements'
 		, [
			//'js/libs/jquery.inputs-20120113.min'
			//, 'js!js/libs/jstorage-0.1.6.1.min.js'
			'js!js/libs/sammy.min.js'
			, pathtojsignature
		]
 		, function() {return $}
 	)
 	
 	define(
 	    "myapp"
 	    , ['jquery', 'js/router', 'requirements']
 	    , function($, router) {
 	        // note, myapp_ may, but does not have to contain RequireJS-compatible define that returns something.
 	        // however, if it contains something like "$(document).ready(function() { ... " already it MAY fire before 
 	        // its depends - sammy, jquery plugins - are fully loaded.
 	        // insdead i recommend that application js returns a generator (function pointer)
 	        // that takes jQuery (with all loaded , applied plugins) 
 	        // The expectation is that before the below return is executed, all depends are loaded (in order of depends tree)
 	        // You could init your app here like so:
 	        return router($) 
 	        // catch the returned instance in require( and run the pre-inited application instance there
 	    }
 	)

	require(['jquery', 'myapp'])
	.then(function($, app) {
		$(document).ready(function() {app.Run()})
	})
})(
	typeof jQuery === "function" ? 
	jQuery : 
	function(){throw new Error("Where is jQuery?")}
);
