// TODO: Mobile. maybe put in a separate file?
$(function() {
	var _window = $(window),
		curSection = $('#home'),
		navLinks = (function() {
			var links = [];
			$('#nav').find('a').each(function() {
				var link = $(this),
					ref = link.attr('href'),
					target = $($('#main').find(ref));
				links[ref.substring(1)] = link; // href without the '#'
				link.click(function(event) {
					event.preventDefault();
					$('html, body').stop();
					// Set scroll target to the start or middle of the target section depending on whether fits on screen
					var scrollTarget = target.offset().top;
					if (target.innerHeight() < _window.innerHeight())
						scrollTarget += target.innerHeight() / 2 - _window.innerHeight() / 2;
					var scrollDuration = 500 + Math.abs($(document).scrollTop() - scrollTarget) * 500 / _window.innerHeight();
					// TODO: cache html + body?
					$('html, body').animate({scrollTop: scrollTarget}, scrollDuration);
				});
			});
			return links;
		}());

	navLinks[curSection.attr('id')].addClass('active');

	// Listener to set active nav link
	_window.scroll(function(event) {
		// Get section at middle of the window
		var elem = document.elementFromPoint(221, _window.innerHeight() / 2); // 221 is nav width + 1. TODO: un-fragile this?
		if (elem.id === curSection.id) return;
		// Set new active link
		navLinks[curSection.attr('id')].removeClass('active');
		curSection = $(elem);
		navLinks[elem.id].addClass('active');
	});
});