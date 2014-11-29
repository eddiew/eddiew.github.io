"use strict";
//$(function() {
$(window).load(function() {
	$('.slideshow').map(function() {return new Slideshow($(this), true);});
});

// SLIDE
// TODO: Add play/pause controls
function Slideshow(slideshow, autoSlide) {
	var self = this;
	this.activeSlideIdx = 0;
	this.slideTimerId;
	this.slides = slideshow.children('.slide');
	this.autoSlide = autoSlide;
	this.$progressBar;
	var progressBar = document.createElement('div');
	progressBar.className = 'progressBar';
	slideshow.append(progressBar);
	this.$progressBar = $(progressBar);
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
		$(this).on('click', function(e) {
			self.slideTo(idx);
		});
	});
	// Activate 1st slide
	this.slides.eq(0).addClass('active');
	this.navDots.eq(0).addClass('active');
	if (autoSlide) this.queueSlide();
}

Slideshow.prototype.queueSlide = function() {
	this.$progressBar.stop();
	var slideshow = this;
	this.$progressBar.fadeOut(1000, function() {
		slideshow.$progressBar.width(0);
		slideshow.$progressBar.show();
		slideshow.$progressBar.animate({width: '100%'}, 4000, 'linear', function() {
			slideshow.slide();
		});
	});
}

Slideshow.prototype.slideTo = function(idx) {
	this.slides.eq(this.activeSlideIdx).removeClass('active');
	this.navDots.eq(this.activeSlideIdx).removeClass('active');
	this.slides.eq(idx).addClass('active');
	this.navDots.eq(idx).addClass('active');
	this.activeSlideIdx = idx;
	if (this.autoSlide) {
		this.queueSlide();
	}
};

Slideshow.prototype.slide = function() {
	this.slideTo((this.activeSlideIdx + 1) % this.slides.length);
};

Slideshow.prototype.autoSlide = function() {
	this.autoSlide = true;
	this.queueSlide();
};