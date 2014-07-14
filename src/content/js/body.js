"use strict";
// Global variables
var $html_body = $('html, body'),
	$window = $(window),
	curSection,
	navLinks = [];

// SCROLL
// TODO: Mobile
function getScrollDuration(distance) {
	return 500 + distance * 500 / $window.height();
}

function scrollTo(pos) {
	$html_body.stop();
	$html_body.bind("scroll mousedown DOMMouseScroll mousewheel keyup", function(){
		$html_body.stop();
	});
	$html_body.animate({scrollTop: pos}, getScrollDuration(Math.abs($window.scrollTop() - pos)), function() {
		$html_body.unbind("scroll mousedown DOMMouseScroll mousewheel keyup");
	});
}

function scrollToTarget(target) {
	// Calculate target scroll height
	var scrollTarget = target.offset().top;
	if (target.innerHeight() < $window.height())
		scrollTarget += target.innerHeight() / 2 - $window.height() / 2;
	scrollTo(scrollTarget);
}

$('#nav').find('a').each(function(idx) {
	var link = $(this),
		target = $(link.attr('href')),
		ref = link.attr('href').substring(1); // href without the '#'
	if (idx === 0) {
		curSection = ref;
		link.addClass('active').
		click(function(event) {
			event.preventDefault();
			scrollTo(0);
		});
	}
	else link.click(function(event) {
			event.preventDefault();
			scrollToTarget(target);
		});
	navLinks[ref] = link;
});

// Listener to set active nav link
// TODO: un-fragile this + mobile
$window.scroll(function() {
	// Get section at middle of the window
	var elem = document.elementFromPoint(221, $window.height() / 2); // 221 is nav width + 1
	if (elem.id === curSection) return;
	// Set new active link
	navLinks[curSection].removeClass('active');
	curSection = elem.id;
	navLinks[curSection].addClass('active');
});

// HELLO
var $home = $('#home'),
	$go = $('#go'),
	$about = $('#about'),
	homeHeight = parseInt($home.innerHeight(), 10),
	minHomeHeight = parseInt($home.css('min-height'), 10),
	aboutHeight = homeHeight + parseInt($('about').innerHeight() / 2 - $window.height() / 2, 10);

// Scroll button control
$go.click(function(event) {
	event.preventDefault();
	scrollToTarget($about);
});

$window.scroll(function() {
	if ($window.scrollTop() > aboutHeight) $go.addClass('active');
	else $go.removeClass('active');
	var shrinkAmt = Math.min(homeHeight - minHomeHeight, $window.scrollTop());
	$home.innerHeight(homeHeight - shrinkAmt);
	$home.css('margin-top', shrinkAmt);
});