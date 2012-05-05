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
return function($) {
	'use strict'
	
	var namespace = 'jSignatureHome'
	
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
		    this.element_selector = '#main_content_wrap'
		})
		
		// ROUTES Have to be defined from complex to simple. Otherwise the shortest match will pick it up first.
		
		app.sammyapp.route('get',/\#\/PageNotFound\//, function() {
			document.title = "404 - Page not found"
		    $.publish(namespace + "_show_404_page")
		    // this.notFound()
		})
		app.sammyapp.route('get',/\#\/demo\//, function() {
			document.title = "jSignature Demo"
			$.publish(namespace + "_show_demo_page")
		})
		app.sammyapp.route('get',/\#\/(.+)/, function() {
			this.app.setLocation("#/PageNotFound/")
		})
		app.sammyapp.route('get',/\#\//, function() {
			document.title = "About jSignature"
		    $.publish(namespace + "_show_about_page")
		})
		app.sammyapp.route('get',/(.*)/, function() {
			this.app.setLocation("#/PageNotFound/")
		})
		
		// ----------------------------------------------------------------------
		
		app.setLocation = function(location){
			app.sammyapp.setLocation(newpath)
		}
		
		//------------------------------------------------------------------------
		// !!! This is what parent code will pull when it's time for us to run !!!
		//------------------------------------------------------------------------
		app.Run = function() {
		    this.sammyapp.run('#/')
		    console.log(this.APP_NAME + " is running")
		}
	}

	
	$.subscribe(
		namespace + "_show_about_page"
		, function(){
            $('#demo').hide()
			$('#about').show()
		}
	)

	
	$.subscribe(
		namespace + "_show_demo_page"
		, function(){
			$('#about').hide()
			
            $('#demo').html('<div id="signatureparent">jSignature inherits colors from here<div id="signature"></div></div><div id="tools"></div><div><p>Display Area:</p><div id="displayarea"></div></div>').show()
            
            var $sigdiv = $('#signature').jSignature()
        	, $tools = $('#tools')
        	, $extraarea = $('#displayarea')
        	, export_plugins = $sigdiv.jSignature('listPlugins','export')
        	, chops = ['<span><b>Extract signature data as: </b></span><select>','<option value="">(select export format)</option>']
        	, name
        	, pubsubprefix = namespace

        	for(var i in export_plugins){
        		if (export_plugins.hasOwnProperty(i)){
        			name = export_plugins[i]
        			chops.push('<option value="' + name + '">' + name + '</option>')
        		}
        	}
        	chops.push('</select><span><b> or: </b></span>')
        	
        	$(chops.join('')).bind('change', function(e){
        		if (e.target.value !== ''){
        			var data = $sigdiv.jSignature('getData', e.target.value)
        			$.publish(pubsubprefix + 'formatchanged')
        			if (typeof data === 'string'){
        				$('textarea', $tools).val(data)
        			} else if($.isArray(data) && data.length === 2){
        				$('textarea', $tools).val(data.join(','))
        				$.publish(pubsubprefix + data[0], data);
        			} else {
        				try {
        					$('textarea', $tools).val(JSON.stringify(data))
        				} catch (ex) {
        					$('textarea', $tools).val('Not sure how to stringify this, likely binary, format.')
        				}
        			}
        		}
        	}).appendTo($tools)

        	
        	$('<input type="button" value="Reset">').bind('click', function(e){
        		$sigdiv.jSignature('reset')
        	}).appendTo($tools)
        	
        	$('<div><textarea style="width:100%;height:7em;"></textarea></div>').appendTo($tools)
        	
        	$.subscribe(pubsubprefix + 'formatchanged', function(){
        		$extraarea.html('')
        	})

        	$.subscribe(pubsubprefix + 'image/svg+xml', function(data) {
        		var i = new Image()
        		i.src = 'data:' + data[0] + ';base64,' + btoa( data[1] )
        		$(i).appendTo($extraarea)
        		
        		var message = [
        			"If you don't see an image immediately above, it means your browser is unable to display in-line (data-url-formatted) SVG."
        			, "This is NOT an issue with jSignature, as we can export proper SVG document regardless of browser's ability to display it."
        			, "Try this page in a modern browser to see the SVG on the page, or export data as plain SVG, save to disk as text file and view in any SVG-capabale viewer."
                   ]
        		$( "<div>" + message.join("<br/>") + "</div>" ).appendTo( $extraarea )
        	});

        	$.subscribe(pubsubprefix + 'image/svg+xml;base64', function(data) {
        		var i = new Image()
        		i.src = 'data:' + data[0] + ',' + data[1]
        		$(i).appendTo($extraarea)
        		
        		var message = [
        			"If you don't see an image immediately above, it means your browser is unable to display in-line (data-url-formatted) SVG."
        			, "This is NOT an issue with jSignature, as we can export proper SVG document regardless of browser's ability to display it."
        			, "Try this page in a modern browser to see the SVG on the page, or export data as plain SVG, save to disk as text file and view in any SVG-capabale viewer."
                   ]
        		$( "<div>" + message.join("<br/>") + "</div>" ).appendTo( $extraarea )
        	});
        	
        	$.subscribe(pubsubprefix + 'image/png;base64', function(data) {
        		var i = new Image()
        		i.src = 'data:' + data[0] + ',' + data[1]
        		$('<span><b>As you can see, one of the problems of "image" extraction (besides not working on some old Androids, elsewhere) is that it extracts A LOT OF DATA and includes all the decoration that is not part of the signature.</b></span>').appendTo($extraarea)
        		$(i).appendTo($extraarea)
        	});
        	
        	$.subscribe(pubsubprefix + 'image/jsignature;base30', function(data) {
        		$('<span><b>This is a vector format not natively render-able by browsers. Format is a compressed "movement coordinates arrays" structure tuned for use server-side. The bonus of this format is its tiny storage footprint and ease of deriving rendering instructions in programmatic, iterative manner.</b></span>').appendTo($extraarea)
        	});
        	
		}
	)

	
	// 2. returning class's instance
	return new RouterClass($, namespace) // notice that this is INITED app, but not started 
	// .Run will be pulled by parent code when it is appropriate
		
} // return function
}) // define