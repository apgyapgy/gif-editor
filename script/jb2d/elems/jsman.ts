export class FilterUtils{
	constructor(){
		
	}
    getPixel = (a, b, f, d, g) =>{
        var c = (f * d + b) * 4;
        if (b < 0 || b >= d || f < 0 || f >= g) 
        	return [a[(this.clampPixel(f, 0, g - 1) * d + this.clampPixel(b, 0, d - 1)) * 4], a[(this.clampPixel(f, 0, g - 1) * d + this.clampPixel(b, 0, d - 1)) * 4 + 1], a[(this.clampPixel(f, 0, g - 1) * d + this.clampPixel(b, 0, d - 1)) * 4 + 2], a[(this.clampPixel(f, 0, g - 1) * d + this.clampPixel(b, 0, d - 1)) * 4 + 3]];
        return [a[c], a[c + 1], a[c + 2], a[c + 3]]
    };
    h = !1,e;
    clampPixel = (a, b, f) => {
        return a < b ? b: a > f ? f: a
    };
    bilinearInterpolate = (a, b, f, d, g, c) => {
        var e = f[0],h = f[1],k = f[2],
        	i = d[0],o = d[1],p = d[2],
        	s = g[0],n = g[1],m = g[2],
        	q = g[3],t = c[0],r = c[1],
        	g = c[2],u = c[3],c = 1 - a,
        	v = 1 - b,
        	f = c * f[3] + a * d[3],
        	f = v * f + b * (c * q + a * u),
        	e = v * (c * e + a * i) + b * (c * s + a * t),
        	h = v * (c * h + a * o) + b * (c * n + a * r);
        return [e, h, v * (c * k + a * p) + b * (c * m + a * g), f]
    };
    transformFilter = (a, b, f, d) => {
        for (var g = [], c = [], e = 0; e < a.length; e++) c[e] = a[e];
	        for (e = 0; e < d; e++) for (var h = 0; h < f; h++) {
	            var k = (e * f + h) * 4;
	            b.apply(this, [h, e, g]);
	            var i = Math.floor(g[0]),
	            o = Math.floor(g[1]),
	            p = g[0] - i,
	            s = g[1] - o,
	            n,
	            m,
	            q;
	            i >= 0 && i < f - 1 && o >= 0 && o < d - 1 
	            	? (i = (f * o + i) * 4, n = [a[i], a[i + 1], a[i + 2], a[i + 3]], m = [a[i + 4], a[i + 5], a[i + 6], a[i + 7]], q = [a[i + f * 4], a[i + f * 4 + 1], a[i + f * 4 + 2], a[i + f * 4 + 3]], i = [a[i + (f + 1) * 4], a[i + (f + 1) * 4 + 1], a[i + (f + 1) * 4 + 2], a[i + (f + 1) * 4 + 3]]) 
	            	: (n = this.getPixel(a, i, o, f, d), m = this.getPixel(a, i + 1, o, f, d), q = this.getPixel(a, i, o + 1, f, d), i = this.getPixel(a, i + 1, o + 1, f, d));
	            p = this.bilinearInterpolate(p, s, n, m, q, i);
	            c[k] = p[0];
	            c[k + 1] = p[1];
	            c[k + 2] = p[2];
	            c[k + 3] = p[3]
	        }
        for (b = 0; b < c.length; b++) a[b] = c[b]
    }
}
export class SineRippleFilter{
	constructor(){
		
	}
    name = "Sine Ripples";
    isDirAnimatable = !1;
    defaultValues = {
        xAmplitude: 5,
        yAmplitude: 5,
        xWavelength: 16,
        yWavelength: 16
    };
    valueRanges = {
        xAmplitude: {
            min: 0,
            max: 30
        },
        yAmplitude: {
            min: 0,
            max: 30
        },
        xWavelength: {
            min: 1,
            max: 50
        },
        yWavelength: {
            min: 1,
            max: 50
        }
    };
    h = new FilterUtils;
    filter = (e, a) => {
        var b = e.width,
        f = e.height,
        d = e.data;
        if (a === void 0) 
        	a = this.defaultValues;
        var g = a.xAmplitude === void 0 ? this.defaultValues.xAmplitude: a.xAmplitude,
        	c = a.yAmplitude === void 0 ? this.defaultValues.yAmplitude: a.yAmplitude,
        	j = a.xWavelength === void 0 ? this.defaultValues.xWavelength: a.xWavelength,
        	l = a.yWavelength === void 0 ? this.defaultValues.yWavelength: a.yWavelength;
        	h.transformFilter(d,function(a, b, d) {
	            var e = Math.sin(a / l);
	            d[0] = a + g * Math.sin(b / j);
	            d[1] = b + c * e
	        },b, f)
    }
}
export class JSManipulate{
	constructor(){
		sineripple: new SineRippleFilter
	}
}
