// TODO: Add controls
$(function() {
	$('.slideshow').each(function() {
		var slideshow = $(this);
		slideshow.activeSlideIdx;
		slideshow.slides = slideshow.children('.slide');
		// Set slideshow height to match tallest slide
		var tallestSlideHeight = 0,
			tallestSlideIdx = 0;
		slideshow.slides.each(function(idx) {
			if ($(this).innerHeight() > tallestSlideHeight) {
				tallestSlideHeight = $(this).innerHeight();
				tallestSlideIdx = idx;
			}
		});
		slideshow.slides.eq(tallestSlideIdx).css('position','static');

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
		// Activate 1st slide
		slideshow.slideTo(0);

		slideshow.autoSlide();
	});
});