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
		case "const":
			for(var i = 0; i <= N_STOPS; i++) {
				gradient.addColorStop(i/N_STOPS, (new ConstHSL(i/N_STOPS, 1, 0.5)).toCss());
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

function getHelixChannel(h, s, l) {
	return applySL(Math.cos(h * 2 * Math.PI), s, l);
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