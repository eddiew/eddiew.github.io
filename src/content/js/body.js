$(function() {
	var _html_body = $('html, body'),
		_window = $(window),
		_document = $(document);

	function scrollToElement(element) {
		return;
	}

	// SLIDE
	// TODO: Add controls

	// s: jQuery object that represents the entire slideshow
	function Slideshow(s) {
		this.activeSlideIdx,
			this.slideTimerId,
			this.slides = s.children('.slide');
		// Set slideshow height to match tallest slide
		var tallestSlideHeight = 0,
			tallestSlideIdx = 0;
		this.slides.each(function(idx, slide) {
			if ($(slide).innerHeight() > tallestSlideHeight) {
				tallestSlideHeight = $(slide).innerHeight();
				tallestSlideIdx = idx;
			}
		});
		this.slides.eq(tallestSlideIdx).css('position','static');
		// Activate 1st slide
		this.slideTo(0);
	}

	Slideshow.prototype = {
		slideTo: function(idx) {
			this.slides.eq(this.activeSlideIdx).removeClass('active');
			this.slides.eq(idx).addClass('active');
			this.activeSlideIdx = idx;
		},
		slide: function() {
			this.slideTo((this.activeSlideIdx+1) % this.slides.length);
		},
		autoSlide: function() {
			var slideshow = this;
			this.slideTimerId = setInterval(function() {
				slideshow.slide();
			},  5000);
		}
	}

	$('.slideshow').each(function() {
		var slideshow = new Slideshow($(this));
		slideshow.autoSlide();
	});

	// SCROLL
	// TODO: Mobile. maybe put in a separate file?
	var curSection,
		navLinks = (function() {
			var links = [];
			$('#nav').find('a').each(function() {
				var link = $(this),
					ref = link.attr('href'),
					target = $(ref);
				links[ref.substring(1)] = link; // href without the '#'
				link.click(function(event) {
					event.preventDefault();
					_html_body.stop();
					// Set scroll target to the start or middle of the target section depending on whether fits on screen
					var scrollTarget = target.offset().top;
					if (target.innerHeight() < _window.innerHeight())
						scrollTarget += target.innerHeight() / 2 - _window.innerHeight() / 2;
					var scrollDuration = 500 + Math.abs(_document.scrollTop() - scrollTarget) * 500 / _window.innerHeight();
					// TODO: cache html + body?
					_html_body.animate({scrollTop: scrollTarget}, scrollDuration);
				});
			});
			return links;
		}());

	// Listener to set active nav link
	_window.scroll(function(event) {
		// Get section at middle of the window
		var elem = document.elementFromPoint(221, _window.innerHeight() / 2); // 221 is nav width + 1. TODO: un-fragile this + mobile support?
		if (elem.id === curSection) return;
		// Set new active link
		if (navLinks[curSection] != null) navLinks[curSection].removeClass('active');
		curSection = elem.id;
		navLinks[curSection].addClass('active');
	});

	// HELLO

	var _home = $('#home'),
		maxHomeHeight = parseInt(_home.innerHeight(), 10), // counting on this to run before _home's height gets adjusted
		minHomeHeight = parseInt(_home.css('min-height'), 10);

	// Scroll button control
	$(_home.find('a')).click(function(event) {
		event.preventDefault();
		var target = $('#about');
		_html_body.stop();
		// Set scroll target to the start or middle of the target section depending on whether fits on screen
		var scrollTarget = target.offset().top;
		if (target.innerHeight() < _window.innerHeight())
			scrollTarget += target.innerHeight() / 2 - _window.innerHeight() / 2;
		var scrollDuration = 500 + Math.abs(_document.scrollTop() - scrollTarget) * 500 / _window.innerHeight();
		// TODO: cache html + body?
		_html_body.animate({scrollTop: scrollTarget}, scrollDuration);
	});

	_window.scroll(function() {
		// if (_document.scrollTop() > maxHomeHeight - minHomeHeight) return;
		// _home.innerHeight(maxHomeHeight - _document.scrollTop());
	});
});