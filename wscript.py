#! /usr/bin/env python
# encoding: utf-8
import subprocess

def importbuild(context):
	subprocess.call(
		'git show stable:jSignature.min.js > js/libs/jSignature.min.js'.split(' ')
		, shell = True
	)
	subprocess.call(
		'git show stable:libs/flashcanvas.js > js/libs/flashcanvas.js'.split(' ')
		, shell = True
	)

def generateseopages(context):
	buildparts = context.Node('./buildparts/')
	subprocess.call(
		[
			context.Node('/bin/phantomjs/phantomjs.exe').absolutepath
			, (buildparts + 'seo_pages_extract.js').absolutepath
			, (buildparts + 'seo_pages.txt').absolutepath
		]
		, shell = True
	)	

def default(context):
	print("====== Importing Recent jSignature build")
	importbuild(context)
	print("====== Exporting SEO-friendly versions of dynamic pages")
	generateseopages(context)


if __name__ == "__main__":
	print("This is a Wak (https://github.com/dvdotsenko/Wak) automation script file.\n(Export 'NOCLIMB' to shell scope and) run 'wak.py' against this folder.")