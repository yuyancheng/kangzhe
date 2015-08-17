(/** @lends <global> */function( window, document, undefined ) {

(function( factory ) {
	"use strict";

	if ( typeof define === 'function' && define.amd ) {
		// Define as an AMD module if possible
		define( 'trees', ['jquery'], factory );
	}else if ( typeof exports === 'object' ) {
    // Node/CommonJS
    module.exports = factory( require( 'jquery' ) );
  }else if ( jQuery && !jQuery.fn.tree ) {
		// Define using browser globals otherwise
		// Prevent multiple instantiations if the script is loaded twice
		factory( jQuery );
	}
}
(/** @lends <global> */function( $ ) {

	var Tree = function(){};


	Tree.setName = function(){
		alert(99999);
	};


	// jQuery access
	$.fn.tree = Tree;

	// Legacy aliases
	$.fn.treeSettings = Tree.settings;
	$.fn.treeExt = Tree.ext;

	// With a capital `D` we return a Tree API instance rather than a
	// jQuery object
	$.fn.Tree = function ( opts ) {
		return $(this).tree( opts ).api();
	};

	// All properties that are available to $.fn.tree should also be
	// available on $.fn.Tree
	$.each( Tree, function ( prop, val ) {
		$.fn.Tree[ prop ] = val;
	} );

	return $.fn.tree;
}));

}(window, document));