(function() {
  var NormalAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Normal = NormalAction = (function(_super) {

    __extends(NormalAction, _super);

    function NormalAction() {
      return NormalAction.__super__.constructor.apply(this, arguments);
    }

    NormalAction.prototype.type = 'normal';

    NormalAction.prototype.name = 'Normal';

    NormalAction.prototype.validations = function(contexts) {
      var errors, warnings;
      errors = [];
      warnings = [];
      if (contexts.length > 1) {
        warnings.push('Normal will only use the first input.');
      }
      if (contexts.length < 1) {
        errors.push('Normal needs exactly 1 input.');
      }
      return {
        errors: errors,
        warnings: warnings
      };
    };

    NormalAction.prototype.render = function(contexts) {
      var b, bl, br, dX, dY, h, index, inputImageData, l, negPixelLen, negRowLen, outputImageData, posPixelLen, posRowLen, r, rowLen, t, tl, tr, w, x, y, _i, _j;
      NormalAction.__super__.render.call(this);
      inputImageData = contexts[0].getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      outputImageData = this.context.getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      w = this.app.getWidth();
      h = this.app.getHeight();
      for (y = _i = 0; 0 <= h ? _i < h : _i > h; y = 0 <= h ? ++_i : --_i) {
        for (x = _j = 0; 0 <= w ? _j < w : _j > w; x = 0 <= w ? ++_j : --_j) {
          rowLen = w << 2;
          index = (x << 2) + y * rowLen;
          negRowLen = -rowLen;
          posRowLen = rowLen;
          negPixelLen = -4;
          posPixelLen = 4;
          if (x === 0) {
            negPixelLen = 0;
          }
          if (x === w - 1) {
            posPixelLen = 0;
          }
          if (y === 0) {
            negRowLen = 0;
          }
          if (y === h - 1) {
            posRowLen = 0;
          }
          tl = inputImageData.data[index + negRowLen + negPixelLen];
          l = inputImageData.data[index + negPixelLen];
          bl = inputImageData.data[index + posPixelLen + negPixelLen];
          t = inputImageData.data[index + negPixelLen];
          b = inputImageData.data[index + posRowLen];
          tr = inputImageData.data[index + negRowLen + posPixelLen];
          r = inputImageData.data[index + posPixelLen];
          br = inputImageData.data[index + posRowLen + posPixelLen];
          dX = tr + 2.0 * r + br - tl - 2.0 * l - bl;
          dY = bl + 2.0 * b + br - tl - 2.0 * t - tr;
          outputImageData.data[index] = (dX + 255) / 2;
          outputImageData.data[index + 1] = (dY + 255) / 2;
          outputImageData.data[index + 2] = 255;
          outputImageData.data[index + 3] = 255;
        }
      }
      this.context.putImageData(outputImageData, 0, 0);
      return this.context;
    };

    return NormalAction;

  })(Webbzeug.Action);

}).call(this);
