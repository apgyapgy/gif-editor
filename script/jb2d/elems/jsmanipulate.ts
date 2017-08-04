function FilterUtils() {
    this.HSVtoRGB = function(a, b, f) {
        var d, g, c, e = Math.floor(a * 6),
        h = a * 6 - e,
        a = f * (1 - b),
        k = f * (1 - h * b),
        b = f * (1 - (1 - h) * b);
        switch (e % 6) {
        case 0:
            d = f;
            g = b;
            c = a;
            break;
        case 1:
            d = k;
            g = f;
            c = a;
            break;
        case 2:
            d = a;
            g = f;
            c = b;
            break;
        case 3:
            d = a;
            g = k;
            c = f;
            break;
        case 4:
            d = b;
            g = a;
            c = f;
            break;
        case 5:
            d = f,
            g = a,
            c = k
        }
        return [d * 255, g * 255, c * 255]
    };
    this.RGBtoHSV = function(a, b, f) {
        a /= 255;
        b /= 255;
        f /= 255;
        var d = Math.max(a, b, f),
        g = Math.min(a, b, f),
        c,
        e = d - g;
        if (d === g) c = 0;
        else {
            switch (d) {
            case a:
                c = (b - f) / e + (b < f ? 6 : 0);
                break;
            case b:
                c = (f - a) / e + 2;
                break;
            case f:
                c = (a - b) / e + 4
            }
            c /= 6
        }
        return [c, d === 0 ? 0 : e / d, d]
    };
    this.getPixel = function(a, b, f, d, g) {
        var c = (f * d + b) * 4;
        if (b < 0 || b >= d || f < 0 || f >= g) return [a[(this.clampPixel(f, 0, g - 1) * d + this.clampPixel(b, 0, d - 1)) * 4], a[(this.clampPixel(f, 0, g - 1) * d + this.clampPixel(b, 0, d - 1)) * 4 + 1], a[(this.clampPixel(f, 0, g - 1) * d + this.clampPixel(b, 0, d - 1)) * 4 + 2], a[(this.clampPixel(f, 0, g - 1) * d + this.clampPixel(b, 0, d - 1)) * 4 + 3]];
        return [a[c], a[c + 1], a[c + 2], a[c + 3]]
    };
    var h = !1,
    e;
    this.gaussianRandom = function() {
        if (h) return h = !1,
        e;
        else {
            var a, b, f;
            do a = 2 * Math.random() - 1,
            b = 2 * Math.random() - 1,
            f = a * a + b * b;
            while (f >= 1 || f === 0);
            f = Math.sqrt( - 2 * Math.log(f) / f);
            e = b * f;
            h = !0;
            return a * f
        }
    };
    this.clampPixel = function(a, b, f) {
        return a < b ? b: a > f ? f: a
    };
    this.triangle = function(a) {
        a = this.mod(a, 1);
        return 2 * (a < 0.5 ? a: 1 - a)
    };
    this.mod = function(a, b) {
        var f = parseInt(a / b, 10);
        a -= f * b;
        if (a < 0) return a + b;
        return a
    };
    this.mixColors = function(a, b, f) {
        var d = this.linearInterpolate(a, b[0], f[0]),
        g = this.linearInterpolate(a, b[1], f[1]),
        c = this.linearInterpolate(a, b[2], f[2]),
        a = this.linearInterpolate(a, b[3], f[3]);
        return [d, g, c, a]
    };
    this.linearInterpolate = function(a, b, f) {
        return b + a * (f - b)
    };
    this.bilinearInterpolate = function(a, b, f, d, g, c) {
        var e = f[0],
        h = f[1],
        k = f[2],
        i = d[0],
        o = d[1],
        p = d[2],
        s = g[0],
        n = g[1],
        m = g[2],
        q = g[3],
        t = c[0],
        r = c[1],
        g = c[2],
        u = c[3],
        c = 1 - a,
        v = 1 - b,
        f = c * f[3] + a * d[3],
        f = v * f + b * (c * q + a * u),
        e = v * (c * e + a * i) + b * (c * s + a * t),
        h = v * (c * h + a * o) + b * (c * n + a * r);
        return [e, h, v * (c * k + a * p) + b * (c * m + a * g), f]
    };
    this.tableFilter = function(a, b, f, d) {
        for (var g = 0; g < d; g++) for (var c = 0; c < f; c++) for (var e = (g * f + c) * 4, h = 0; h < 3; h++) a[e + h] = b[a[e + h]]
    };
    this.convolveFilter = function(a, b, f, d) {
        var g = [],
        c,
        e;
        c = e = Math.sqrt(b.length);
        c = parseInt(c / 2, 10);
        for (var h = parseInt(e / 2, 10), k = 0; k < d; k++) for (var i = 0; i < f; i++) {
            for (var o = (k * f + i) * 4, p = 0, s = 0, n = 0, m = -c; m <= c; m++) for (var q = k + m,
            q = 0 <= q && q < d ? q * f: k * f, t = e * (m + c) + h, r = -h; r <= h; r++) {
                var u = b[t + r];
                if (u !== 0) {
                    var v = i + r;
                    0 <= v && v < f || (v = i);
                    v = (q + v) * 4;
                    p += u * a[v];
                    s += u * a[v + 1];
                    n += u * a[v + 2]
                }
            }
            g[o] = parseInt(p + 0.5, 10);
            g[o + 1] = parseInt(s + 0.5, 10);
            g[o + 2] = parseInt(n + 0.5, 10);
            g[o + 3] = a[o + 3]
        }
        for (b = 0; b < g.length; b++) a[b] = g[b]
    };
    this.transformFilter = function(a, b, f, d) {
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
            i >= 0 && i < f - 1 && o >= 0 && o < d - 1 ? (i = (f * o + i) * 4, n = [a[i], a[i + 1], a[i + 2], a[i + 3]], m = [a[i + 4], a[i + 5], a[i + 6], a[i + 7]], q = [a[i + f * 4], a[i + f * 4 + 1], a[i + f * 4 + 2], a[i + f * 4 + 3]], i = [a[i + (f + 1) * 4], a[i + (f + 1) * 4 + 1], a[i + (f + 1) * 4 + 2], a[i + (f + 1) * 4 + 3]]) : (n = this.getPixel(a, i, o, f, d), m = this.getPixel(a, i + 1, o, f, d), q = this.getPixel(a, i, o + 1, f, d), i = this.getPixel(a, i + 1, o + 1, f, d));
            p = this.bilinearInterpolate(p, s, n, m, q, i);
            c[k] = p[0];
            c[k + 1] = p[1];
            c[k + 2] = p[2];
            c[k + 3] = p[3]
        }
        for (b = 0; b < c.length; b++) a[b] = c[b]
    }
}

function SineRippleFilter() {
    this.name = "Sine Ripples";
    this.isDirAnimatable = !1;
    this.defaultValues = {
        xAmplitude: 5,
        yAmplitude: 5,
        xWavelength: 16,
        yWavelength: 16
    };
    this.valueRanges = {
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
    var h = new FilterUtils;
    this.filter = function(e, a) {
        var b = e.width,
        f = e.height,
        d = e.data;
        if (a === void 0) a = this.defaultValues;
        var g = a.xAmplitude === void 0 ? this.defaultValues.xAmplitude: a.xAmplitude,
        c = a.yAmplitude === void 0 ? this.defaultValues.yAmplitude: a.yAmplitude,
        j = a.xWavelength === void 0 ? this.defaultValues.xWavelength: a.xWavelength,
        l = a.yWavelength === void 0 ? this.defaultValues.yWavelength: a.yWavelength;
        h.transformFilter(d,
        function(a, b, d) {
            var e = Math.sin(a / l);
            d[0] = a + g * Math.sin(b / j);
            d[1] = b + c * e
        },
        b, f)
    }
}
var JSManipulate = {
    sineripple: new SineRippleFilter
};
//module.exports = {
//	JSManipulate:new SineRippleFilter,
//}