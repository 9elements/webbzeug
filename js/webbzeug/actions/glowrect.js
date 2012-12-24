(function() {
  var GlowrectAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Glowrect = GlowrectAction = (function(_super) {

    __extends(GlowrectAction, _super);

    function GlowrectAction() {
      return GlowrectAction.__super__.constructor.apply(this, arguments);
    }

    GlowrectAction.prototype.type = 'glowrect';

    GlowrectAction.prototype.name = 'GlowRect';

    GlowrectAction.prototype.availableParameters = function() {
      return {
        centerX: {
          name: 'Center X',
          type: 'integer',
          min: 0,
          max: 255,
          "default": 128,
          scrollPrecision: 1
        },
        centerY: {
          name: 'Center Y',
          type: 'integer',
          min: 0,
          max: 255,
          "default": 128,
          scrollPrecision: 1
        },
        width: {
          name: 'Width',
          type: 'integer',
          min: 1,
          max: 255,
          "default": 0,
          scrollPrecision: 1
        },
        height: {
          name: 'Height',
          type: 'integer',
          min: 1,
          max: 255,
          "default": 0,
          scrollPrecision: 1
        },
        radius: {
          name: 'Radius',
          type: 'integer',
          min: 1,
          max: 255,
          "default": 30,
          scrollPrecision: 1
        },
        power: {
          name: 'Power',
          type: 'integer',
          min: 1,
          max: 100,
          "default": 1,
          scrollPrecision: 1
        },
        color: {
          name: 'Color',
          type: 'color',
          "default": 'rgba(255,255,255,1)'
        }
      };
    };

    GlowrectAction.prototype.validations = function(contexts) {
      var warnings;
      warnings = [];
      if (contexts.length > 1) {
        warnings.push('GlowRect will only use the first input.');
      }
      return {
        warnings: warnings
      };
    };

    GlowrectAction.prototype.render = function(contexts) {
      var centerX, centerY, colorRGB, dist, distX, distY, h, height, imageData, index, power, radius, value, w, width, x, y, _i, _j;
      GlowrectAction.__super__.render.call(this);
      centerX = parseInt(this.getParameter('centerX'));
      centerY = parseInt(this.getParameter('centerY'));
      radius = parseInt(this.getParameter('radius'));
      width = parseInt(this.getParameter('width'));
      height = parseInt(this.getParameter('height'));
      power = parseFloat(this.getParameter('power'));
      power = power * 0.2;
      if (power < 1) {
        power = 1;
      }
      colorRGB = Webbzeug.Utilities.getRgb2(this.getParameter('color'));
      this.copyRendered(contexts);
      w = this.app.getWidth();
      h = this.app.getHeight();
      imageData = this.context.getImageData(0, 0, w, h);
      for (x = _i = 0; 0 <= w ? _i < w : _i > w; x = 0 <= w ? ++_i : --_i) {
        for (y = _j = 0; 0 <= h ? _j < h : _j > h; y = 0 <= h ? ++_j : --_j) {
          index = ((y * w) + x) << 2;
          /*
                    SEGMENTS:
          
                    0 | 1 | 2
                    ---------
                    3 | 4 | 5
                    ---------
                    6 | 7 | 8
          */

          if (x < centerX - width / 2 && y < centerY - height / 2) {
            distX = centerX - width / 2 - x;
            distY = centerY - height / 2 - y;
            dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
          } else if (x > centerX + width / 2 && y < centerY - height / 2) {
            distX = centerX + width / 2 - x;
            distY = centerY - height / 2 - y;
            dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
          } else if (x > centerX + width / 2 && y > centerY + height / 2) {
            distX = centerX + width / 2 - x;
            distY = centerY + height / 2 - y;
            dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
          } else if (x < centerX - width / 2 && y > centerY + height / 2) {
            distX = centerX - width / 2 - x;
            distY = centerY + height / 2 - y;
            dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
          } else if (x < centerX - width / 2) {
            distX = dist = centerX - width / 2 - x;
            distY = 0;
          } else if (x > centerX + width / 2) {
            distX = dist = x - (centerX + width / 2);
            distY = 0;
          } else if (y < centerY - height / 2) {
            distY = dist = centerY - height / 2 - y;
            distX = 0;
          } else if (y > centerY + height / 2) {
            distY = dist = y - (centerY + height / 2);
            distX = 0;
          } else {
            distX = distY = dist = 0;
          }
          value = 255 - (dist / radius * 255);
          value = value * power;
          if (value > 255) {
            value = 255;
          }
          imageData.data[index] = colorRGB[0] / 255 * value;
          imageData.data[index + 1] = colorRGB[1] / 255 * value;
          imageData.data[index + 2] = colorRGB[2] / 255 * value;
          imageData.data[index + 3] = 255;
        }
      }
      this.context.putImageData(imageData, 0, 0);
      return this.context;
    };

    return GlowrectAction;

  })(Webbzeug.Action);

}).call(this);
