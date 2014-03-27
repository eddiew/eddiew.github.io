// TODO: Add controls
$(function() {
	// Load slideshows
	var slideshows = $('.slideshow');

	slideshows.each(function() {
		var slideshow = $(this);
		slideshow.activeSlideIdx = 0;
		slideshow.slides = slideshow.children('.slide');
		// Set slideshow height to match tallest slide
		var tallestSlideHeight = 0;
		slideshow.slides.each(function() {
			if ($(this).innerHeight() > tallestSlideHeight) tallestSlideHeight = $(this).innerHeight();
		});
		slideshow.height(tallestSlideHeight);
		// Activate 1st slide
		slideshow.slides.eq(slideshow.activeSlideIdx).addClass('active');

		slideshow.slideTo = function(idx) {
			slideshow.slides.eq(slideshow.activeSlideIdx).removeClass('active');
			slideshow.slides.eq(idx).addClass('active');
			slideshow.activeSlideIdx = idx;
		}

		slideshow.slide = function() {
			slideshow.slideTo((slideshow.activeSlideIdx+1) % slideshow.slides.length);
		}

		slideshow.autoSlide = function() {
			slideshow.slideTimerId = setInterval(function() {
				slideshow.slide();
			},  5000);
		}

		slideshow.autoSlide();
	});
});