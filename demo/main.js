;(function(){

define(function (){
	'use strict'

	// default action is always to return an executable object - function - upon load.
	// We provide the function, the caller calls it with args specific to the route.

	// everything inside this function will be ran again and again every time the 
	// route is called. You can keep some data "global" by assigning it to a var outside
	// of this returned function. Example:
	var moduleLevelCache = {"my global data":'my global value'}
	// you can stick values like compiled templates etc into this "store" 
	// for reuse on next run of this same route.

	return function(){
		'use strict'

		// Everything here will be ran again and again on every request for this route

		var context = this

		document.title = "jSignature - Demo"

		require(
			['jquery', 'pubsub','jsignature']
			, function($, PubSub){
				
				var PS = new PubSub()
				
	            context.app.$element().html(
					'<div id="signatureparent">'+
						'jSignature inherits colors from parent elements'+
						'<div id="signature"></div>'+
					'</div>'+
					'<div class="shrinkwidth_parent"><span><div id="demotools" class="shrinkwidth_subject"></div></span></div>'+
					'<div><textarea style="width:100%;height:7em;"></textarea></div>'+
					'<div><p>Display Area:</p><div id="displayarea"></div></div>'
				).show()
	            
	            var UndoButtonRenderer = function(){
					// this === jSignatureInstance 
					var undoButtonSytle = 'position:absolute;display:none;margin:0 !important;top:auto;padding: 0.5em !important;'
					, $undoButton = $('<input type="button" value="Undo last stroke" style="'+undoButtonSytle+'" />')
						.appendTo(this.$controlbarUpper)

					// this centers the button against the canvas.
					var buttonWidth = $undoButton.width()
					$undoButton.css(
						'left'
						, Math.round(( this.canvas.width - buttonWidth ) / 2)
					)
					// IE 7 grows the button. Correcting for that.
					if ( buttonWidth !== $undoButton.width() ) {
						$undoButton.width(buttonWidth)
					}

					return $undoButton
				}

	            var $sigdiv = $('#signature').jSignature({'UndoButton':UndoButtonRenderer})
	        	, $tools = $('#demotools')
	        	, $extraarea = $('#displayarea')

	        	//=====================================
	        	// setting up controls (select box, reset and undo buttons)

	        	// the select box:
	        	, export_plugins = $sigdiv.jSignature('listPlugins','export')
	        	, chops = [
					'<span><b>Extract signature data as: </b></span>'
					, '<select>'
					, '<option value="">(select export format)</option>'
	        	]
	        	, name
	        	, pubsubprefix = 'DEMO'

	        	for(var i in export_plugins){
	        		if (export_plugins.hasOwnProperty(i)){
	        			name = export_plugins[i]
	        			chops.push('<option value="' + name + '">' + name + '</option>')
	        		}
	        	}
	        	chops.push('</select><span><b> or </b></span>')
	        	
	        	$(chops.join('')).bind('change', function(e){
	        		if (e.target.value !== ''){
	        			var data = $sigdiv.jSignature('getData', e.target.value)
	        			PS.publish('formatchanged')
	        			if (typeof data === 'string'){
	        				$('textarea').val(data)
	        			} else if($.isArray(data) && data.length === 2){
	        				$('textarea').val(data.join(','))
	        				PS.publish(data[0], data);
	        			} else {
	        				try {
	        					$('textarea').val(JSON.stringify(data))
	        				} catch (ex) {
	        					$('textarea').val('Not sure how to stringify this, likely binary, format.')
	        				}
	        			}
	        		}
	        	}).appendTo($tools)

	        	// reset button
				$('<input type="button" value="Reset" disabled>').bind('click', function(e){
					PS.publish('reset')
				}).appendTo($tools)

				PS.subscribe('reset', function(){
					$sigdiv.jSignature('reset')
				})

				$('#signature').on('change', function(e){
	        		var undef
	        		if ($(e.target).jSignature('getData','native').length) {
	        			$tools.find('input').prop('disabled', false)	        			
	        		} else {
	        			$tools.find('input').prop('disabled', true)
	        		}

				})

	        	//==================
	        	// setting up display areas:

	        	PS.subscribe('formatchanged', function(){
	        		$extraarea.html('')
	        	})

	        	PS.subscribe('image/svg+xml', function(data) {
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

	        	PS.subscribe('image/svg+xml;base64', function(data) {
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
	        	
	        	PS.subscribe('image/png;base64', function(data) {
	        		var i = new Image()
	        		i.src = 'data:' + data[0] + ',' + data[1]
	        		$('<span><b>As you can see, one of the problems of "image" extraction (besides not working on some old Androids, elsewhere) is that it extracts A LOT OF DATA and includes all the decoration that is not part of the signature.</b></span>').appendTo($extraarea)
	        		$(i).appendTo($extraarea)
	        	});
	        	
	        	PS.subscribe('image/jsignature;base30', function(data) {
	        		$('<span><b>This is a vector format not natively render-able by browsers. Format is a compressed "movement coordinates arrays" structure tuned for use server-side. The bonus of this format is its tiny storage footprint and ease of deriving rendering instructions in programmatic, iterative manner.</b></span>').appendTo($extraarea)
	        	});
	        	
			}
		)
	}
})

})()