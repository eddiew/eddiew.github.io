"use strict";
// Global variables
var $html_body,
	$window,
	curSection,
	navLinks = {};

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

$(function() {
	$html_body = $('html, body');
	$window = $(window);

	$('#navlist').find('a').each(function(idx) {
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
		if (navLinks[curSection] != null) navLinks[curSection].addClass('active');
	});

	// HELLO SLIDE
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
		if ($window.scrollTop() > aboutHeight) $go.addClass('inactive');
		else $go.removeClass('inactive');
		var shrinkAmt = Math.min(homeHeight - minHomeHeight, $window.scrollTop());
		$home.innerHeight(homeHeight - shrinkAmt);
		$home.css('margin-top', shrinkAmt);
	});
});
"use strict";
//$(function() {
$(window).load(function() {
	$('.slideshow').map(function() {return new Slideshow($(this));});
});

// SLIDE
// TODO: Add play/pause controls
function Slideshow(slideshow) {
	var self = this;
	this.activeSlideIdx = 0,
	this.slideTimerId,
	this.slides = slideshow.children('.slide');
	var dotsList = document.createElement('ul');
	dotsList.className = "slidenav";
	// Set slideshow height to match tallest slide
	var tallestSlideHeight = 0,
		tallestSlideIdx = 0;
	this.slides.each(function(idx) {
		if ($(this).innerHeight() > tallestSlideHeight) {
			tallestSlideHeight = $(this).innerHeight();
			tallestSlideIdx = idx;
		}
		dotsList.appendChild(document.createElement('li'));
	}).
	eq(tallestSlideIdx).css('position','static');
	slideshow.append(dotsList);
	this.navDots = $(dotsList.children);
	this.slides.each(function() {
		$(this).css('top', tallestSlideHeight / 2 - $(this).innerHeight() / 2);
	});
	// Set up nav dots
	this.navDots.each(function(idx) {
		$(this).on('click', function(e){
			clearInterval(self.slideTimerId);
			self.slideTo(idx);
			self.autoSlide();
		});
	});
	// Activate 1st slide
	this.slides.eq(0).addClass('active');
	this.navDots.eq(0).addClass('active');
	this.autoSlide();
}

Slideshow.prototype.slideTo = function(idx) {
	this.slides.eq(this.activeSlideIdx).removeClass('active');
	this.navDots.eq(this.activeSlideIdx).removeClass('active');
	this.slides.eq(idx).addClass('active');
	this.navDots.eq(idx).addClass('active');
	this.activeSlideIdx = idx;
};

Slideshow.prototype.slide = function() {
	this.slideTo((this.activeSlideIdx+1) % this.slides.length);
};

Slideshow.prototype.autoSlide = function() {
	var slideshow = this;
	this.slideTimerId = setInterval(function() {
		slideshow.slide();
	}, 5000);
};
"use strict";
var N_STOPS = 24;
var helixdemo, context, w, h;

$(function() {
	helixdemo = document.getElementById('helixDemo');
	context = helixdemo.getContext('2d');
	w = helixdemo.width, h = helixdemo.height;
	redraw();
});

function redraw() {
	var gradient = context.createLinearGradient(0, 0, w, 0);
	switch(document.querySelector('input[name="type"]:checked').value) {
		case "helix":
			for(var i = 0; i <= N_STOPS; i++) {
				gradient.addColorStop(i/N_STOPS, (new HelixHSL(i/N_STOPS, 1, 0.5)).toCss());
			}
			break;
		case "saturated":
			for(var i = 0; i <= N_STOPS; i++) {
				gradient.addColorStop(i/N_STOPS, (new HelixHSLSaturated(i/N_STOPS, 1, 0.5)).toCss());
			}
			break;
		case "standard":
			for(var i = 0; i <= N_STOPS; i++) {
				gradient.addColorStop(i/N_STOPS, rgbToString(hslToRgb(i/N_STOPS, 1, 0.5)));
			}
			break;
	}
	context.fillStyle = gradient;
	context.fillRect(0, 0, w, h);
}

function RGB(r, g, b) {
	this.r = r, this.g = g, this.b = b;
}

function HelixHSL(h, s, l) {
	this.r = getHelixChannel(h, s, l),
	this.g = getHelixChannel(h - 1/3, s, l),
	this.b = getHelixChannel(h - 2/3, s, l);
}

HelixHSL.prototype = RGB.prototype;

function ConstHSL(h, s, l) {
	var sector = Math.round(h * 6);
	var offset = h * 6 - sector;
	var r, g, b;
	switch (sector % 6) {
		case 0: // Red
			r = 1;
			g = offset-0.5;
			b = -offset-0.5;
			break;
		case 1: // Yellow
			r = -offset+0.5;
			g = offset+0.5;
			b = -1;
			break;
		case 2: // Green
			r = -offset-0.5;
			g = 1;
			b = offset-0.5;
			break;
		case 3: // Cyan
			r = -1;
			g = -offset+0.5;
			b = offset+0.5;
			break;
		case 4: // Blue
			r = offset-0.5;
			g = -offset-0.5;
			b = 1;
			break;
		case 5: // Magenta
			r = offset+0.5;
			g = -1;
			b = -offset+0.5;
			break;
	}
	this.r = applySL(r, s, l);
	this.g = applySL(g, s, l);
	this.b = applySL(b, s, l);
}

ConstHSL.prototype = RGB.prototype;

function HelixHSLSaturated(h, s, l) {
	this.r = getSatHelixChannel(h, s, l),
	this.g = getSatHelixChannel(h - 1/3, s, l),
	this.b = getSatHelixChannel(h - 2/3, s, l);
}

HelixHSLSaturated.prototype = RGB.prototype;

function getHelixChannel(h, s, l) {
	return applySL(Math.cos(h * 2 * Math.PI), s, l);
}

function getSatHelixChannel(h, s, l) {
	var hmod = h - Math.floor(h);
	var channel = 1;
	if (hmod > 11/12) {
		// channel = 1;
	}
	else if (hmod > 7/12) {
		channel = Math.sin((hmod-9/12)*3*Math.PI);
	}
	else if (hmod > 5/12) {
		channel = -1;
	}
	else if (hmod > 1/12) {
		channel = Math.cos((hmod-1/12)*3*Math.PI);
	}
	return applySL(channel, s, l);
}

function hexFromChannel(num) {
	if (num > 0xFF) return 'FF';
	else if (num > 0xF) return Math.round(num).toString(16);
	else if (num > 0) return '0' + Math.round(num).toString(16);
	else return '00';
}

RGB.prototype.toHex = function() {
	return '#' + hexFromChannel(this.r) + hexFromChannel(this.g) + hexFromChannel(this.b);
};

RGB.prototype.toCss = function() {
    return 'rgb(' + Math.round(this.r).toString() + ',' + Math.round(this.g).toString() + ',' + Math.round(this.b).toString() + ')';
};

function applySL(channel, s, l) {
	return 255 * (channel * Math.min(l, Math.min(s / 2, 1-l)) + l);
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Object          The RGB representation as an object
 */
function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2Rgb(p, q, h + 1 / 3);
        g = hue2Rgb(p, q, h);
        b = hue2Rgb(p, q, h - 1 / 3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    }
}

function hue2Rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}

function rgbToString(rgb) {
    return 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
}