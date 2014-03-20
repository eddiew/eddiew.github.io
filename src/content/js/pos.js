// This file handles DOM element positioning
$(function (){
	// Store DOM elements
	var _main = $('#main');

	// misc initialization
	document.body.setAttribute('margin', 0);

	function reposition() {
		var width = getBrowserWidth();
		switch (activeLayout) {
		case 'pc':
			_main.width(width - 220);// 220px is the hardcoded nav width
			break;
		}
	}

	// Run changeLayout function when page resizes.
	// addEvent(window, 'resize', reposition);

	// triggerEvent(window, 'resize');
});