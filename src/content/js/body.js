$(function() {
	var _html_body = $('html, body'),
		_window = $(window);

	// SLIDE
	// TODO: Add controls

	function Slideshow(slideshow) {
		this.activeSlideIdx,
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

	function getScrollDuration(distance) {
		return 500 + distance * 500 / _window.innerHeight();
	}

	function scrollHome() {
		_html_body.stop();
		_html_body.animate({scrollTop: 0}, getScrollDuration(_window.scrollTop()));
	}

	function scrollTo(target) {
		_html_body.stop();
		// Calculate target scroll height
		var scrollTarget = target.offset().top;
		if (target.innerHeight() < _window.innerHeight())
			scrollTarget += target.innerHeight() / 2 - _window.innerHeight() / 2;
		_html_body.animate({scrollTop: scrollTarget}, getScrollDuration(Math.abs(_window.scrollTop() - scrollTarget)));
	}

	// TODO: Mobile
	var curSection,
		navLinks = (function() {
			var links = [];
			$('#nav').find('a').each(function() {
				var link = $(this),
					ref = link.attr('href'),
					target = $(ref);
				links[ref.substring(1)] = link; // href without the '#'
				if (ref === "#home") link.click(function(event) {
					event.preventDefault();
					scrollHome();
				});
				else link.click(function(event) {
					event.preventDefault();
					scrollTo(target);
				});
			});
			return links;
		}());

	// Listener to set active nav link
	// TODO: un-fragile this + mobile
	_window.scroll(function() {
		// Get section at middle of the window
		var elem = document.elementFromPoint(221, _window.innerHeight() / 2); // 221 is nav width + 1
		if (elem.id === curSection) return;
		// Set new active link
		if (navLinks[curSection] != null) navLinks[curSection].removeClass('active');
		curSection = elem.id;
		navLinks[curSection].addClass('active');
	});

	// HELLO

	var _home = $('#home'),
		_go = $('#go'),
		_about = $('#about'),
		homeHeight = parseInt(_home.innerHeight(), 10),
		minHomeHeight = parseInt(_home.css('min-height'), 10),
		aboutHeight = homeHeight + parseInt($('about').innerHeight() / 2 - _window.innerHeight() / 2, 10);
	
	// Scroll button control
	_go.click(function(event) {
		event.preventDefault();
		scrollTo(_about);
	});

	_window.scroll(function(event) {
		if (_window.scrollTop() > aboutHeight) _go.addClass('active');
		else _go.removeClass('active');
		var shrinkAmt = Math.min(homeHeight - minHomeHeight, _window.scrollTop());
		_home.css('margin-top', shrinkAmt);
		_home.innerHeight(homeHeight - shrinkAmt);
	});
});