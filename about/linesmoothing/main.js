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
		, contentfolder = context.pathFolder + '/'

		document.title = "jSignature - Line Smoothing Logic"

		if (moduleLevelCache.articleHtmlString) {
			console.log("populating from cache", context.path)
			context.app.swap(moduleLevelCache.articleHtmlString)
		} else {
			require(
				[
					'js/libs/markdown'
					,'text!' + contentfolder + 'explanation_of_smoothing_logic.md'
				]
				, function(MD, text){
					
					var converter = new MD.Converter();
					var html = converter.makeHtml(
						text.split('{{contentfolder}}').join(contentfolder)
					) + '<div id="content_is_ready" style="display:none;"></div>'
					moduleLevelCache.articleHtmlString = html
					context.app.swap(html)
				}
			)
		} // end else
	}
})

}).call(typeof window === 'obejct' ? window : this )