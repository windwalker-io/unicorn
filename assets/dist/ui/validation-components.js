/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/ui/validation-components.js":
/*!*************************************************!*\
  !*** ./src/modules/ui/validation-components.js ***!
  \*************************************************/
/***/ (() => {

throw new Error("Module build failed (from ../../../../node_modules/babel-loader/lib/index.js):\nSyntaxError: /Applications/XAMPP/xamppfiles/htdocs/earth/vendor/windwalker/unicorn/assets/src/modules/ui/validation-components.js: Unexpected token (560:0)\n\n\u001b[0m \u001b[90m 558 |\u001b[39m   }\u001b[0m\n\u001b[0m \u001b[90m 559 |\u001b[39m\u001b[0m\n\u001b[0m\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 560 |\u001b[39m \u001b[33m<<\u001b[39m\u001b[33m<<\u001b[39m\u001b[33m<<\u001b[39m\u001b[33m<\u001b[39m \u001b[33mHEAD\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m     |\u001b[39m \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 561 |\u001b[39m   checkCustomDataAttributeValidity() {\u001b[0m\n\u001b[0m \u001b[90m 562 |\u001b[39m     \u001b[36mconst\u001b[39m error \u001b[33m=\u001b[39m \u001b[36mthis\u001b[39m\u001b[33m.\u001b[39m$input\u001b[33m.\u001b[39mdataset\u001b[33m.\u001b[39mvalidationFail\u001b[33m;\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 563 |\u001b[39m\u001b[0m\n    at instantiate (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/@babel/parser/lib/index.js:72:32)\n    at constructor (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/@babel/parser/lib/index.js:372:12)\n    at Parser.raise (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/@babel/parser/lib/index.js:3720:19)\n    at Parser.unexpected (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/@babel/parser/lib/index.js:3758:16)\n    at Parser.parsePropertyName (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/@babel/parser/lib/index.js:14063:24)\n    at Parser.parseClassElementName (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/@babel/parser/lib/index.js:16021:17)\n    at Parser.parseClassMemberWithIsStatic (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/@babel/parser/lib/index.js:15896:22)\n    at Parser.parseClassMember (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/@babel/parser/lib/index.js:15860:10)\n    at /Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/@babel/parser/lib/index.js:15800:14\n    at Parser.withSmartMixTopicForbiddingContext (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/@babel/parser/lib/index.js:14528:14)\n    at Parser.parseClassBody (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/@babel/parser/lib/index.js:15775:10)\n    at Parser.parseClass (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/@babel/parser/lib/index.js:15749:22)\n    at Parser.parseExportDeclaration (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/@babel/parser/lib/index.js:16337:25)\n    at Parser.maybeParseExportDeclaration (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/@babel/parser/lib/index.js:16283:31)\n    at Parser.parseExport (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/@babel/parser/lib/index.js:16187:29)\n    at Parser.parseStatementContent (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/@babel/parser/lib/index.js:15004:27)\n    at Parser.parseStatement (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/@babel/parser/lib/index.js:14872:17)\n    at Parser.parseBlockOrModuleBlockBody (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/@babel/parser/lib/index.js:15556:25)\n    at Parser.parseBlockBody (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/@babel/parser/lib/index.js:15547:10)\n    at Parser.parseProgram (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/@babel/parser/lib/index.js:14769:10)\n    at Parser.parseTopLevel (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/@babel/parser/lib/index.js:14756:25)\n    at Parser.parse (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/@babel/parser/lib/index.js:16915:10)\n    at parse (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/@babel/parser/lib/index.js:16967:38)\n    at parser (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/@babel/core/lib/parser/index.js:52:34)\n    at parser.next (<anonymous>)\n    at normalizeFile (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/@babel/core/lib/transformation/normalize-file.js:87:38)\n    at normalizeFile.next (<anonymous>)\n    at run (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/@babel/core/lib/transformation/index.js:31:50)\n    at run.next (<anonymous>)\n    at transform (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/@babel/core/lib/transform.js:29:41)\n    at transform.next (<anonymous>)\n    at step (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/gensync/index.js:261:32)\n    at /Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/gensync/index.js:273:13\n    at async.call.result.err.err (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/gensync/index.js:223:11)\n    at /Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/gensync/index.js:189:28\n    at /Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/@babel/core/lib/gensync-utils/async.js:84:7\n    at /Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/gensync/index.js:113:33\n    at step (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/gensync/index.js:287:14)\n    at /Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/gensync/index.js:273:13\n    at async.call.result.err.err (/Applications/XAMPP/xamppfiles/htdocs/earth/node_modules/gensync/index.js:223:11)");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module doesn't tell about it's top-level declarations so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/modules/ui/validation-components.js"]();
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});