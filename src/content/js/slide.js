$(function() {
	// Load slideshows
	var activewSlide = 0,
		wSlide = $('#workSlide'),
		wSlides = wSlide.children(),
		wNavDots = $('#workSlideNav').children(),
		slideTimerId,
		queued = false;

	function slideTo(idx) {
		wSlides.eq(activewSlide).removeClass('active');
		wNavDots.eq(activewSlide).removeClass('active');
		wSlides.eq(idx).addClass('active');
		wNavDots.eq(idx).addClass('active');
		activewSlide = idx;
	}

	function slide() {
		slideTo((activewSlide+1) % wSlides.length);
	}

	// Transition slides every 4.236 seconds (1.618^3)
	function autoSlide() {
		slideTimerId = setInterval(function() {
			if (wSlide.is(':hover'))
				queued = true;
			else
				slide();
		},  4236);
	}

	autoSlide();

	wSlide.mouseleave(function() {
		if(queued) {
			queued = false;
			clearInterval(slideTimerId);
			slide();
			autoSlide();
		}
	});
	
	wNavDots.each(function(idx, elem) {
		$(elem).click(function() {
			if(idx != activewSlide) {
				clearInterval(slideTimerId);
				slideTo(idx);
				autoSlide();
			}
		});
	});
});