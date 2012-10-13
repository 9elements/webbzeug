(function() {
  var HSCBAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.HSCB = HSCBAction = (function(_super) {

    __extends(HSCBAction, _super);

    function HSCBAction() {
      return HSCBAction.__super__.constructor.apply(this, arguments);
    }

    HSCBAction.prototype.type = 'hscb';

    HSCBAction.prototype.availableParameters = function() {
      return {
        hue: {
          name: "Hue",
          type: 'number',
          min: -180,
          max: 180,
          "default": 0
        },
        saturation: {
          name: "Saturation",
          type: 'number',
          min: -100,
          max: 100,
          "default": 0
        },
        contrast: {
          name: "Contrast",
          type: 'number',
          min: 0,
          max: 255,
          "default": 127
        },
        brightness: {
          name: "Brightness",
          type: 'number',
          min: 0,
          max: 255,
          "default": 127
        }
      };
    };

    HSCBAction.prototype.validations = function(contexts) {
      var errors, warnings;
      warnings = [];
      errors = [];
      if (contexts.length > 1) {
        warnings.push('HSCB will only use the first input.');
      }
      if (contexts.length < 1) {
        errors.push('HSCB needs exactly 1 input.');
      }
      return {
        errors: errors,
        warnings: warnings
      };
    };

    HSCBAction.prototype.render = function(contexts) {
      var b, brightness, contrast, g, hsv, i, imageData, index, j, r, rgb, _i, _j, _ref2;
      HSCBAction.__super__.render.call(this);
      contrast = this.getParameter('contrast');
      contrast = contrast / 128;
      brightness = this.getParameter('brightness') - 127;
      imageData = contexts[0].getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      for (i = _i = 0, _ref2 = imageData.data.length / 4; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
        index = i << 2;
        r = imageData.data[index];
        g = imageData.data[index + 1];
        b = imageData.data[index + 2];
        hsv = this.rgb2hsv(r, g, b);
        hsv.h += this.getParameter('hue') / 360;
        if (hsv.h > 360) {
          hsv.h -= 360;
        } else if (hsv.h < 0) {
          hsv.h += 360;
        }
        hsv.s += this.getParameter('saturation') / 100;
        hsv.s = Math.max(0, Math.min(hsv.s, 100));
        rgb = this.hsv2rgb(hsv.h, hsv.s, hsv.v);
        imageData.data[index] = rgb.r;
        imageData.data[index + 1] = rgb.g;
        imageData.data[index + 2] = rgb.b;
        for (j = _j = 0; _j < 3; j = ++_j) {
          imageData.data[index + j] = imageData.data[index + j] * contrast;
          imageData.data[index + j] = imageData.data[index + j] + brightness;
          imageData.data[index + j] = Math.min(imageData.data[index + j], 255);
        }
      }
      this.context.putImageData(imageData, 0, 0);
      return this.context;
    };

    HSCBAction.prototype.rgb2hsv = function(r, g, b) {
      var d, h, max, min, s, v;
      r = r / 255;
      g = g / 255;
      b = b / 255;
      max = Math.max(r, g, b);
      min = Math.min(r, g, b);
      d = max - min;
      v = max;
      s = max === 0 ? 0 : d / max;
      if (d === 0) {
        h = 0;
      } else {
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
        }
        h /= 6;
      }
      return {
        h: h,
        s: s,
        v: v
      };
    };

    HSCBAction.prototype.hsv2rgb = function(h, s, v) {
      var b, f, g, i, p, q, r, t;
      i = Math.floor(h * 6);
      f = h * 6 - i;
      p = v * (1 - s);
      q = v * (1 - f * s);
      t = v * (1 - (1 - f) * s);
      switch (i % 6) {
        case 0:
          r = v;
          g = t;
          b = p;
          break;
        case 1:
          r = q;
          g = v;
          b = p;
          break;
        case 2:
          r = p;
          g = v;
          b = t;
          break;
        case 3:
          r = p;
          g = q;
          b = v;
          break;
        case 4:
          r = t;
          g = p;
          b = v;
          break;
        case 5:
          r = v;
          g = p;
          b = q;
      }
      return {
        r: r * 255,
        g: g * 255,
        b: b * 255
      };
    };

    return HSCBAction;

  })(Webbzeug.Action);

}).call(this);
