// Global variables
var $html_body = $('html, body'),
	$window = $(window),
	_slideshows = $('.slideshow').map(function() {return new Slideshow($(this));}).get();

// SLIDE
// TODO: Add controls
function Slideshow(slideshow) {
	this.activeSlideIdx = 0,
		this.slideTimerId,
		this.slides = slideshow.children('.slide');
	// Set slideshow height to match tallest slide
	var tallestSlideHeight = 0,
		tallestSlideIdx = 0;
	this.slides.each(function(idx) {
		if ($(this).innerHeight() > tallestSlideHeight) {
			tallestSlideHeight = $(this).innerHeight();
			tallestSlideIdx = idx;
		}
	}).
	eq(tallestSlideIdx).css('position','static');
	// Activate 1st slide
	this.slides.eq(0).addClass('active');
}
Slideshow.prototype.slideTo = function(idx) {
	this.slides.eq(this.activeSlideIdx).removeClass('active');
	this.slides.eq(idx).addClass('active');
	this.activeSlideIdx = idx;
};
Slideshow.prototype.slide = function() {
	this.slideTo((this.activeSlideIdx+1) % this.slides.length);
};
Slideshow.prototype.autoSlide = function() {
	var slideshow = this;
	this.slideTimerId = setInterval(function() {
		slideshow.slide();
	},  5000);
};

// SCROLL
// TODO: Mobile
function getScrollDuration(distance) {
	return 500 + distance * 500 / $window.height();
}
function scrollTo(pos) {
	$html_body.stop();
	$html_body.animate({scrollTop: pos}, getScrollDuration(Math.abs($window.scrollTop() - pos)));
}
function scrollToTarget(target) {
	// Calculate target scroll height
	var scrollTarget = target.offset().top;
	if (target.innerHeight() < $window.height())
		scrollTarget += target.innerHeight() / 2 - $window.height() / 2;
	scrollTo(scrollTarget);
}
var curSection,
	navLinks = [];
$('#nav').find('a').each(function(idx) {
	var link = $(this),
		ref = link.attr('href').substring(1), // href without the '#'
		target = $('#' + ref);
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

// POST-LOAD WORK

$window.load(function() {
	_slideshows.forEach(function(slideshow) {slideshow.autoSlide();});
});