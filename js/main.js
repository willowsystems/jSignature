/** @preserve
 * Copyright 2012 Willow Systems Corporation (willow-systems.com)
*/

;(function(){
'use strict'

function PubSub(){
    'use strict'
    /**  @preserve 
    -----------------------------------------------------------------------------------------------
    2012 (c) ddotsenko@willowsystems.com
    based on Peter Higgins (dante@dojotoolkit.org)
    Loosely based on Dojo publish/subscribe API, limited in scope. Rewritten blindly.
    Original is (c) Dojo Foundation 2004-2010. Released under either AFL or new BSD, see:
    http://dojofoundation.org/license for more information.
    -----------------------------------------------------------------------------------------------
    */
    this.topics = {};
    /**
     * Allows caller to emit an event and pass arguments to event listeners.
     * @public
     * @function
     * @param topic {String} Name of the channel on which to voice this event
     * @param **arguments Any number of arguments you want to pass to the listeners of this event.
     */
    this.publish = function(topic, arg1, arg2, etc) {
        'use strict'
        if (this.topics[topic]) {
            var currentTopic = this.topics[topic]
            , args = Array.prototype.slice.call(arguments, 1)
            
            for (var i = 0, l = currentTopic.length; i < l; i++) {
                currentTopic[i].apply(null, args);
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
    this.subscribe = function(topic, callback) {
        'use strict'
        if (!this.topics[topic]) {
            this.topics[topic] = [callback];
        } else {
            this.topics[topic].push(callback);
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
    this.unsubscribe = function(token) {
        if (this.topics[token.topic]) {
            var currentTopic = this.topics[token.topic]
            
            for (var i = 0, l = currentTopic.length; i < l; i++) {
                if (currentTopic[i] === token.callback) {
                    currentTopic.splice(i, 1)
                }
            }
        }
    };
};

require(
	['jquery']
	, function($){
	"use strict"

	define(
		'pubsub'
		, function() {return PubSub}
	)

 	define(
 		'sammyjs'
 		, ['js!js/libs/sammy.min.js']
 		, function() {return $}
 	)
	
 	define(
 		'jsignature'
 		, ['js!js/libs/jSignature.min.js']
 		, function() {return $}
 	)

 	define(
 		'mustache'
 		, ['js!js/libs/mustache.min.js']
 		, function(){
 			return Mustache
 		}
 	)
 	
 	define(
 	    "myapp"
 	    , ['js/router', 'sammyjs', 'jsignature']
 	    , function(router) {
 	        // note, myapp_ may, but does not have to contain RequireJS-compatible define that returns something.
 	        // however, if it contains something like "$(document).ready(function() { ... " already it MAY fire before 
 	        // its depends - sammy, jquery plugins - are fully loaded.
 	        // insdead i recommend that application js returns a generator (function pointer)
 	        // that takes jQuery (with all loaded , applied plugins) 
 	        // The expectation is that before the below return is executed, all depends are loaded (in order of depends tree)
 	        // You could init your app here like so:
 	        return router 
 	        // catch the returned instance in require( and run the pre-inited application instance there
 	    }
 	)

	require(
		['jquery', 'myapp']
		,function($, Initializer) {
			$(document).ready(function() {Initializer($).Run()})
		}
	)
})

}).call(typeof window === 'object' ? window : this )