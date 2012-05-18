/*

 A javascript port of Markdown, as used on Stack Overflow
 and the rest of Stack Exchange network.

 Largely based on showdown.js by John Fraser (Attacklab).

 Original Markdown Copyright (c) 2004-2005 John Gruber
 <http://daringfireball.net/projects/markdown/>


 Original Showdown code copyright (c) 2007 John Fraser

 Modifications and bugfixes (c) 2009 Dana Robinson
 Modifications and bugfixes (c) 2009-2011 Stack Exchange Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

 // Usage:
 //
 //   var text = "Markdown *rocks*.";
 //
 //   var converter = new Markdown.Converter();
 //   var html = converter.makeHtml(text);
 //
 //   alert(html);

 http://code.google.com/p/pagedown/

*/
(function(){var h;h="object"===typeof exports&&"function"===typeof require?exports:{};(function(){function r(e){return e}function t(){return!1}function u(){}function v(){}u.prototype={chain:function(e,i){var k=this[e];if(!k)throw Error("unknown hook "+e);this[e]=k===r?i:function(e){return i(k(e))}},set:function(e,i){if(!this[e])throw Error("unknown hook "+e);this[e]=i},addNoop:function(e){this[e]=r},addFalse:function(e){this[e]=t}};h.HookCollection=u;v.prototype={set:function(e,i){this["s_"+e]=i},
get:function(e){return this["s_"+e]}};h.Converter=function(){function e(a){return a=a.replace(/^[ ]{0,3}\[(.+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?(?=\s|$)[ \t]*\n?[ \t]*((\n*)["(](.+?)[")][ \t]*)?(?:\n+)/gm,function(a,c,b,g,e,j){c=c.toLowerCase();l.set(c,A(b));if(e)return g;j&&m.set(c,j.replace(/"/g,"&quot;"));return""})}function i(a){a=a.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del)\b[^\r]*?\n<\/\2>[ \t]*(?=\n+))/gm,k);a=a.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math)\b[^\r]*?.*<\/\2>[ \t]*(?=\n+)\n)/gm,
k);a=a.replace(/\n[ ]{0,3}((<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,k);a=a.replace(/\n\n[ ]{0,3}(<!(--(?:|(?:[^>-]|-[^>])(?:[^-]|-[^-])*)--)>[ \t]*(?=\n{2,}))/g,k);return a=a.replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,k)}function k(a,d){var c;c=d.replace(/^\n+/,"");c=c.replace(/\n+$/g,"");return c="\n\n~K"+(p.push(c)-1)+"K\n\n"}function h(a,d){a=t(a);a=a.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm,"<hr />\n");a=a.replace(/^[ ]{0,2}([ ]?-[ ]?){3,}[ \t]*$/gm,"<hr />\n");a=
a.replace(/^[ ]{0,2}([ ]?_[ ]?){3,}[ \t]*$/gm,"<hr />\n");a=B(a);a=G(a);a=H(a);a=i(a);return a=I(a,d)}function q(a){a=J(a);a=r(a);a=a.replace(/\\(\\)/g,w);a=a.replace(/\\([`*_{}\[\]()>#+-.!])/g,w);a=a.replace(/(!\[(.*?)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,C);a=a.replace(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,C);a=a.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,x);a=a.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?((?:\([^)]*\)|[^()])*?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,
x);a=a.replace(/(\[([^\[\]]+)\])()()()()()/g,x);a=K(a);a=a.replace(/~P/g,"://");a=A(a);a=a.replace(/([\W_]|^)(\*\*|__)(?=\S)([^\r]*?\S[\*_]*)\2([\W_]|$)/g,"$1<strong>$3</strong>$4");a=a.replace(/([\W_]|^)(\*|_)(?=\S)([^\r\*_]*?\S)\2([\W_]|$)/g,"$1<em>$3</em>$4");return a=a.replace(/  +\n/g," <br>\n")}function r(a){return a=a.replace(/(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--(?:|(?:[^>-]|-[^>])(?:[^-]|-[^-])*)--)>)/gi,function(a){var c=a.replace(/(.)<\/?code>(?=.)/g,"$1`");return c=n(c,"!"==a.charAt(1)?
"\\`*_/":"\\`*_")})}function x(a,d,c,b,g,e,j,f){void 0==f&&(f="");a=c.replace(/:\/\//g,"~P");b=b.toLowerCase();if(""==g)if(""==b&&(b=a.toLowerCase().replace(/ ?\n/g," ")),void 0!=l.get(b))g=l.get(b),void 0!=m.get(b)&&(f=m.get(b));else if(-1<d.search(/\(\s*\)$/m))g="";else return d;g=L(g);g=n(g,"*_");d='<a href="'+g+'"';""!=f&&(f=y(f),f=n(f,"*_"),d+=' title="'+f+'"');return d+(">"+a+"</a>")}function y(a){return a.replace(/>/g,"&gt;").replace(/</g,"&lt;").replace(/"/g,"&quot;")}function C(a,d,c,b,g,
e,j,f){a=c;b=b.toLowerCase();f||(f="");if(""==g)if(""==b&&(b=a.toLowerCase().replace(/ ?\n/g," ")),void 0!=l.get(b))g=l.get(b),void 0!=m.get(b)&&(f=m.get(b));else return d;a=n(y(a),"*_[]()");g=n(g,"*_");d='<img src="'+g+'" alt="'+a+'"';f=y(f);f=n(f,"*_");return d+(' title="'+f+'"')+" />"}function t(a){a=a.replace(/^(.+)[ \t]*\n=+[ \t]*\n+/gm,function(a,c){return"<h1>"+q(c)+"</h1>\n\n"});a=a.replace(/^(.+)[ \t]*\n-+[ \t]*\n+/gm,function(a,c){return"<h2>"+q(c)+"</h2>\n\n"});return a=a.replace(/^(\#{1,6})[ \t]*(.+?)[ \t]*\#*\n+/gm,
function(a,c,b){a=c.length;return"<h"+a+">"+q(b)+"</h"+a+">\n\n"})}function B(a){var a=a+"~0",d=/^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;s?a=a.replace(d,function(a,b,d){a=-1<d.search(/[*+-]/g)?"ul":"ol";b=D(b,a);b=b.replace(/\s+$/,"");return"<"+a+">"+b+"</"+a+">\n"}):(d=/(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/g,a=a.replace(d,function(a,b,d,e){a=-1<e.search(/[*+-]/g)?"ul":"ol";d=D(d,a);
return b+"<"+a+">\n"+d+"</"+a+">\n"}));return a=a.replace(/~0/,"")}function D(a,d){s++;var a=a.replace(/\n{2,}$/,"\n"),c=M[d],b=!1,a=(a+"~0").replace(RegExp("(^[ \\t]*)("+c+")[ \\t]+([^\\r]+?(\\n+))(?=(~0|\\1("+c+")[ \\t]+))","gm"),function(a,d,c,f){a=f;(d=/\n\n$/.test(a))||-1<a.search(/\n{2,}/)||b?a=h(z(a),!0):(a=B(z(a)),a=a.replace(/\n$/,""),a=q(a));b=d;return"<li>"+a+"</li>\n"}),a=a.replace(/~0/g,"");s--;return a}function G(a){a=(a+"~0").replace(/(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g,
function(a,c,b){a=E(z(c));a=F(a);a=a.replace(/^\n+/g,"");a=a.replace(/\n+$/g,"");return"\n\n"+("<pre><code>"+a+"\n</code></pre>")+"\n\n"+b});return a=a.replace(/~0/,"")}function N(a){a=a.replace(/(^\n+|\n+$)/g,"");return"\n\n~K"+(p.push(a)-1)+"K\n\n"}function J(a){return a=a.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,function(a,c,b,e){a=e.replace(/^([ \t]*)/g,"");a=a.replace(/[ \t]*$/g,"");a=E(a);a=a.replace(/:\/\//g,"~P");return c+"<code>"+a+"</code>"})}function E(a){a=a.replace(/&/g,"&amp;");
a=a.replace(/</g,"&lt;");a=a.replace(/>/g,"&gt;");return a=n(a,"*_{}[]\\",!1)}function H(a){return a=a.replace(/((^[ \t]*>[ \t]?.+\n(.+\n)*\n*)+)/gm,function(a,c){var b;b=c.replace(/^[ \t]*>[ \t]?/gm,"~0");b=b.replace(/~0/g,"");b=b.replace(/^[ \t]+$/gm,"");b=h(b);b=b.replace(/(^|\n)/g,"$1  ");b=b.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm,function(a,b){var c;c=b.replace(/^  /mg,"~0");return c=c.replace(/~0/g,"")});return N("<blockquote>\n"+b+"\n</blockquote>")})}function I(a,d){for(var a=a.replace(/^\n+/g,
""),a=a.replace(/\n+$/g,""),c=a.split(/\n{2,}/g),b=[],e=/~K(\d+)K/,h=c.length,j=0;j<h;j++){var f=c[j];e.test(f)?b.push(f):/\S/.test(f)&&(f=q(f),f=f.replace(/^([ \t]*)/g,"<p>"),f+="</p>",b.push(f))}if(!d){h=b.length;for(j=0;j<h;j++)for(var i=!0;i;)i=!1,b[j]=b[j].replace(/~K(\d+)K/g,function(a,b){i=!0;return p[b]})}return b.join("\n\n")}function A(a){a=a.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g,"&amp;");return a=a.replace(/<(?![a-z\/?\$!])/gi,"&lt;")}function K(a){a=a.replace(/(^|\s)(https?|ftp)(:\/\/[-A-Z0-9+&@#\/%?=~_|\[\]\(\)!:,\.;]*[-A-Z0-9+&@#\/%=~_|\[\]])($|\W)/gi,
"$1<$2$3>$4");return a=a.replace(/<((https?|ftp):[^'">\s]+)>/gi,function(a,c){return'<a href="'+c+'">'+o.plainLinkText(c)+"</a>"})}function O(a){return a=a.replace(/~E(\d+)E/g,function(a,c){var b=parseInt(c);return String.fromCharCode(b)})}function z(a){a=a.replace(/^(\t|[ ]{1,4})/gm,"~0");return a=a.replace(/~0/g,"")}function F(a){if(!/\t/.test(a))return a;var d=["    ","   ","  "," "],c=0,b;return a.replace(/[\n\t]/g,function(a,e){if("\n"===a)return c=e+1,a;b=(e-c)%4;c=e+1;return d[b]})}function L(a){if(!a)return"";
var d=a.length;return a.replace(P,function(c,b){return"~D"==c?"%24":":"==c&&(b==d-1||/[0-9\/]/.test(a.charAt(b+1)))?":":"%"+c.charCodeAt(0).toString(16)})}function n(a,d,c){d="(["+d.replace(/([\[\]\\])/g,"\\$1")+"])";c&&(d="\\\\"+d);return a=a.replace(RegExp(d,"g"),w)}function w(a,d){return"~E"+d.charCodeAt(0)+"E"}var o=this.hooks=new u;o.addNoop("plainLinkText");o.addNoop("preConversion");o.addNoop("postConversion");var l,m,p,s;this.makeHtml=function(a){if(l)throw Error("Recursive call to converter.makeHtml");
l=new v;m=new v;p=[];s=0;a=o.preConversion(a);a=a.replace(/~/g,"~T");a=a.replace(/\$/g,"~D");a=a.replace(/\r\n/g,"\n");a=a.replace(/\r/g,"\n");a=F("\n\n"+a+"\n\n");a=a.replace(/^[ \t]+$/mg,"");a=i(a);a=e(a);a=h(a);a=O(a);a=a.replace(/~D/g,"$$");a=a.replace(/~T/g,"~");a=o.postConversion(a);p=m=l=null;return a};var M={ol:"\\d+[.]",ul:"[*+-]"},P=/(?:["'*()[\]:]|~D)/g}})();"function"===typeof define&&define.amd?define(function(){return h}):this.Markdown=h}).apply("undefined"!==typeof window?window:this);
