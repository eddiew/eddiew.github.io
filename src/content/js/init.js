$(function (){
});

jQuery(window).load(function() {
	/*********************************************************************************/
	/* Settings                                                                      */
	/*********************************************************************************/

	var settings = {
		resizeSpeed:	300,		// Speed to resize panel
		sizeFactor:		11.5,		// Size factor
		sizeMin:		12,			// Minimum point size
		sizeMax:		24,			// Maximum point size
	};

	/*********************************************************************************/
	/* Vars                                                                          */
	/*********************************************************************************/

	var	_window = jQuery(window),
		_document = jQuery(document),
		_main = jQuery('#main'),
		_panels = _main.find('.panel'),
		_body = jQuery('body'),
		_hbw = jQuery('html,body,window'),
		_footer = jQuery('#footer'),
		_wrapper = jQuery('#wrapper'),
		_nav = jQuery('#nav'),
		_nav_links = _nav.find('a'),
		_jumplinks = jQuery('.jumplink');
		
	var	curPanel,
		navLinks = [],
		activePanelId = 'home',
		isLocked = false,
		hash = window.location.hash.substring(1),
		isTouch = !!('ontouchstart' in window),
		isLegacyIE = (navigator.userAgent.match(/MSIE ([0-9]+)\./) && RegExp.$1 <= 9);
	
	if (isTouch) {
		_nav_links.find('span').remove();
	}

	// Hash nav links for fast lookups
	_nav_links.each(function() {
		var link = jQuery(this), id = link.attr('href').substring(1);
		navLinks[id] = link;
	});

	/*********************************************************************************/
	/* PJAX                                                                          */
	/*********************************************************************************/

	$(document)
		.pjax('#nav a','#main')
		.on('pjax:send', function() {
			// Activate new nav link
			navLinks[activePanelId].removeClass('active');
			navLinks[id].addClass('active');

			// Fade out old panel
			_main.fadeOut(resizeSpeed / 2, 'linear');

			// Show loading spinner?
		})
		.on('pjax:complete', function() {
			var newPanel = _main.children(":first");
			// Hide loading spinner?

			// Add padding if new panel will add scrolling
			if (activeLayout != 'pc')
				var navHeight = _nav.outerHeight();
			if (newPanel.outerHeight() + _footer.outerHeight() + navHeight > _window.height())
				_wrapper.addClass('tall');
			else 
				_wrapper.removeClass('tall');

			// Calculate top padding
			// if (isTouch && (window.orientation == 0 || window.orientation == 180))
			// 	return Math.max(((_window.height() - (panels[panelId].outerHeight() + _footer.outerHeight())) / 2), 30) + 'px';
			// else
			var topPadding = ((_window.height() - newPanel.outerHeight() - navHeight) / 2) + 'px';

			// Set new top padding
			_wrapper.animate({'padding-top': topPadding}, resizeSpeed);

			// Resize main to height of new panel
			_main.animate({'height': newPanel.outerHeight()}, resizeSpeed);

			// Scroll to top
			_hbw.animate({'scrollTop': 0}, resizeSpeed);

			// Fade in new panel
			_main.fadeIn(resizeSpeed / 2, 'linear');
		});

	/*********************************************************************************/
	/* Main (Desktop)                                                                */
	/*********************************************************************************/

	function calc_padding_top_px(panelId) {
		if (isTouch && (window.orientation == 0 || window.orientation == 180))
			return Math.max(((_window.height() - (panels[panelId].outerHeight() + _footer.outerHeight())) / 2), 30) + 'px';
		else
			return (((_window.height() - panels[panelId].outerHeight()) / 2)) + 'px';
	}

	_body.reposition = function() {
		var factor = (_window.width() * _window.height()) / (1440 * 900);
		_body.css('font-size', Math.min(Math.max(Math.floor(factor * settings.sizeFactor), settings.sizeMin), settings.sizeMax) + 'pt');
		_main.height(panels[activePanelId].outerHeight());
		_wrapper.css('padding-top', calc_padding_top_px(activePanelId));
		_nav.css('margin-top', -(_nav.outerHeight) / 2);
	}

	function activatePanel(id, resizeSpeed) {
		if(typeof(resizeSpeed) === 'undefined')
			resizeSpeed = settings.resizeSpeed;
		// Check lock state and determine whether we're already at the target
		if (isLocked || id == activePanelId)
			return false;

		// Lock during page swap
		isLocked = true;
			
		// Change hash
		window.location.hash = '#' + id;

		// Add padding if new panel will overflow the viewport
		var navHeight = 0;
		if (activeLayout != 'pc')
			navHeight = _nav.outerHeight();
		if (panels[id].outerHeight() + _footer.outerHeight() + navHeight > _window.height())
			_wrapper.addClass('tall');

		// Recalculate padding-top
		_wrapper.animate({
			'padding-top': calc_padding_top_px(id)
		}, resizeSpeed);

		// Resize main to height of new panel
		_main.animate({
			'height': panels[id].outerHeight()
		}, resizeSpeed);

		// Fade out old panel and fade in the new one
		panels[activePanelId].fadeOut(resizeSpeed / 2, 'linear', function() {
			panels[id].fadeIn(resizeSpeed / 2, 'linear', function() {
				isLocked = false;
				activePanelId = id;
				if(_wrapper.height() <= _window.height())
					_wrapper.removeClass('tall');
			});
		});
	}

	// Add jumplinks to nav & attach click handler
	// _nav_links.add(_jumplinks).click(function(e) {
	// 	var href = jQuery(this).attr('href');
	
	// 	if (href.substring(0,1) == '#') {
	// 		e.preventDefault();
	// 		e.stopPropagation();

	// 		var linkPanelId = href.substring(1);
			
	// 		if (linkPanelId in panels)
	// 			activatePanel(linkPanelId);
	// 	}
	// });

	// Load non-default panel if specified
	// if (hash && hash in panels)
	// 	activatePanel(hash,0);

	// Attach resize event to window
	// TODO: figure out whether to do this with jQuery or pure JS
	addEvent(window, 'resize', function() {
		// if (!isLocked)
			_body.reposition();
	});
	// _window.resize(function() {
	// 	if(!isLocked)
	// 		_body.reposition();
	// });

	// Trigger initial resize
	// _window.trigger('resize');
	triggerEvent(window,'resize');

	// Fade 
	_wrapper.fadeTo(settings.resizeSpeed, 1.0);

	/*********************************************************************************/
	/* Mobile                                                                        */
	/*********************************************************************************/
	
});