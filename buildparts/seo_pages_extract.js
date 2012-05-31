/** @preserve
Script screen-scraping dynamic web pages and altering the content
to ensure links to original dynamic content still work.

Run against phantomjs (http://code.google.com/p/phantomjs/)

Copyright 2012 Willow Systems Corporation (willow-systems.com)

All rights reserved.
*/


function getDynamicPageSource(){
	'use strict'

	var log = ['Started inner']
	var $ = window.jQuery
	var $html = $('html')

	log.push('getDynamicPageSource - have $html with length' + $html.length)

	$html.find('script').remove()
	// $html.find('style').remove()

	// Some links on the page must change.
	// '#' - starting links heed to be prefixed with something like "./"
	// because the SEO-compatible file will actually be SEPARATE
	// file / path than the original file, albeit in the same folder.

	var hrefprefix = window.location.href.split(window.location.hash)[0]
	, hrefparts = hrefprefix.split('/')

	// last part in hrefparts may be '' or 'somethinghere.ext'
	// depending on if the original actual (non-hash) URI
	// ends in "folder" ('...asdf/folderlike/#/dynamic/hash/') 
	// or "file" ('...asdf/filelike.ext#/dynamic/hash/')
	
	// Thus, we are determining what reworked url prefix will be. 
	// It can be just './' or may need to be './somefilelike'

	, urlprefix = './' + hrefparts[hrefparts.length - 1]

	$html.find('a').each(function(index, element){
		var h = $(element).attr('href')
		if (h && h[0] === '#') {
			console.log("Found link starting with '#'. Prefixing.")
			$(element).attr('href', urlprefix + h)
		}
	})

	return {
		'log': log.join('\n') + '\n'
		, 'name': encodeURIComponent(window.location.hash)
		, 'encodedName': encodeURIComponent(encodeURIComponent(window.location.hash))
		, 'html': '<!DOCTYPE html><html>' + $html.html() + '</html>'
	}
}

function savePageToFile(address, donecallback, checkElementId){
	'use strict'

	console.log("=== Opening '"+address+"'")
	var t = Date.now()
	, page = require('webpage').create()

	page.open(address, function (status) {

		var readyfn = function(){
		    // var content = page.evaluate(getDynamicPageSource);
		    // console.log(content.html)

		    var returnvalue = page.evaluate(getDynamicPageSource)

		    // console.log('Log:\n' + returnvalue.log)

			require('fs').write(
				returnvalue.name + '.html'
				, returnvalue.html
				, 'w'
			)
			donecallback(address)
		}

		var t = Date.now()

		function readychecker(){
			var seconds = 10 * 1000

			if (!checkElementId ||
				page.evaluate(new Function("return window.document.getElementById('"+checkElementId+"') ? true : false"))
			){
				console.log("=== '"+ address +"' Done rendering page.")
				readyfn()
			} else if (Date.now() - t > seconds) { 
				throw new Error( 
					"=== '" + address +
					"' !!!!TIMING OUT!!!! Don't see the selector ID '" + 
					checkElementId+"'"
				)
			} else {
				console.log(
					"=== '"+ address +
					"' Waiting for " + 
					Math.round(( seconds - ( Date.now() - t ) ) / 1000) +
					" more seconds for element ID '" + 
					checkElementId + "' to show up"
				)
				setTimeout(
					readychecker
					, 1000
				)
			}
		}

		if (status === 'success') {
			console.log("=== Loaded '"+address+"'")			
			readychecker()
		} else {
		    console.log('=== FAILED to load "'+address+'"')
		}
	})
}

function savePagesToFiles(){
	if (!phantom.args.length) {
		throw new Error("Need a filename of the file that contains the list of URIs.")
	} else {
		var listOfURIs = require('fs').read(phantom.args[0]).split('\n')
		, uri, i, tmp
		, cleanListToIDMap = {}

		// splitting trailing white space from 
		for (i = listOfURIs.length - 1; i >= 0; i--) {
			uri = listOfURIs[i].trim()
			if (uri) {
				// line in the list file may contain TWO things
				// the URI and the element ID to be watched for
				// as for signal that the page had loaded.
				// the elementID is not required, but can be
				// given after a space. Examples:
				// "prefix://domain/path/#hash elementID"
				tmp = uri.split(' ')
				if (tmp.length === 1) {
					cleanListToIDMap[uri] = ''
				} else {
					cleanListToIDMap[tmp[0].trim()] = tmp[1].trim()
				}
			};
		}

		var listCopy = Object.keys(cleanListToIDMap)

		function filedonecallback(uri){
			var i = listCopy.indexOf(uri)
			if (i !== -1) {
				listCopy.splice(i, 1)
			}

			if (listCopy.length) {
				savePageToFile( listCopy[0], filedonecallback, cleanListToIDMap[listCopy[0]] )
			} else {
				phantom.exit();
			}
		}

		filedonecallback('')
	}
}

savePagesToFiles()
