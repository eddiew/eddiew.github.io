var N_STOPS = 24;

var demobox, context, w, h;

$window.load(function() {
	demobox = document.getElementById('cubehelixDemo');
	context = demobox.getContext('2d');
	w = demobox.width, h = demobox.height;
	redraw();
});

function redraw() {
	var gradient = context.createLinearGradient(0, 0, w, 0);
	switch(document.querySelector('input[name="type"]:checked').value) {
		case "cubehelix":
			for(var i = 0; i <= N_STOPS; i++) {
				gradient.addColorStop(i/N_STOPS, (new CubehelixFromHSL(i/N_STOPS, 1, 0.5)).toRGB());
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

// takes h, s, l in range 0-1
// returns RGB representation as Object
function CubehelixFromHSL(h, s, l) {
	this.h = h, this.s = s, this.l = l;
	this.r = this.getChannel(h, s, l),
	this.g = this.getChannel(h - 1/3, s, l),
	this.b = this.getChannel(h - 2/3, s, l);
}

CubehelixFromHSL.prototype.getChannel = function(h, s, l) {
	return Math.round(255 * (Math.cos(h * 2 * Math.PI) * Math.min(l, Math.min(s / 2, 1-l)) + l));
};

CubehelixFromHSL.prototype.hexFromChannel = function(num) {
	if (num > 0xFF) return 'FF';
	else if (num > 0xF) return num.toString(16);
	else if (num > 0) return '0' + num.toString(16);
	else return '00';
};

CubehelixFromHSL.prototype.toHex = function() {
	return '#' + this.hexFromChannel(this.r) + this.hexFromChannel(this.g) + this.hexFromChannel(this.b);
};

CubehelixFromHSL.prototype.toRGB = function() {
    return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
};

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