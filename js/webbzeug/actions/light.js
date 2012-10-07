(function() {
  var LightAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Light = LightAction = (function(_super) {

    __extends(LightAction, _super);

    function LightAction() {
      return LightAction.__super__.constructor.apply(this, arguments);
    }

    LightAction.prototype.type = 'light';

    LightAction.prototype.availableParameters = function() {
      return {
        x: {
          name: 'X',
          type: 'number',
          min: 0,
          max: 256,
          "default": 32
        },
        y: {
          name: 'Y',
          type: 'number',
          min: 0,
          max: 256,
          "default": 128
        }
      };
    };

    LightAction.prototype.render = function(contexts) {
      var V, W, deltaHypotenuse, h, i, inputImageData, intensity, outputImageData, posX, posY, px1, px2, px3, px4, w, x, y, _i, _j, _k, _l, _m;
      LightAction.__super__.render.call(this);
      this.context.canvas.width *= 2;
      if (contexts.length === 0) {
        console.log("Dude a light needs an input");
        return;
      }
      inputImageData = contexts[0].getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      outputImageData = this.context.getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      w = this.app.getWidth();
      h = this.app.getHeight();
      posX = parseInt(this.getParameter('x'));
      posY = parseInt(this.getParameter('y'));
      deltaHypotenuse = [];
      for (x = _i = w; w <= 0 ? _i < 0 : _i > 0; x = w <= 0 ? ++_i : --_i) {
        for (y = _j = h; h <= 0 ? _j < 0 : _j > 0; y = h <= 0 ? ++_j : --_j) {
          V = (x - w / 2) / 128;
          W = (y - h / 2) / 128;
          deltaHypotenuse[y * w + x] = Math.max(0, 1 - Math.sqrt(V * V + W * W)) * 256;
        }
      }
      for (x = _k = w; w <= 0 ? _k < 0 : _k > 0; x = w <= 0 ? ++_k : --_k) {
        for (y = _l = h; h <= 0 ? _l < 0 : _l > 0; y = h <= 0 ? ++_l : --_l) {
          px1 = inputImageData.data[this.getPixelIndex(x, y + 1) + 2];
          px2 = inputImageData.data[this.getPixelIndex(x, y - 1) + 2];
          px3 = inputImageData.data[this.getPixelIndex(x + 1, y) + 2];
          px4 = inputImageData.data[this.getPixelIndex(x - 1, y) + 2];
          intensity = this.luminosity(deltaHypotenuse[this.luminosity(px1 - px2 - y + posY) * w + this.luminosity(px3 - px4 - x + posX)]);
          for (i = _m = 0; _m < 3; i = ++_m) {
            outputImageData.data[this.getPixelIndex(x, y) + i] = intensity;
          }
          outputImageData.data[this.getPixelIndex(x, y) + 3] = w - 1;
        }
      }
      this.context.putImageData(outputImageData, 0, 0);
      return this.context;
    };

    LightAction.prototype.getPixelIndex = function(x, y) {
      return (y * 256 + x) * 4;
    };

    LightAction.prototype.luminosity = function(d) {
      return Math.round(Math.min(Math.max(d, 0), this.app.getWidth() - 1));
    };

    return LightAction;

  })(Webbzeug.Action);

}).call(this);
