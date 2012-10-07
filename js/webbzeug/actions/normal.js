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

    NormalAction.prototype.availableParameters = function() {
      return {};
    };

    NormalAction.prototype.render = function(contexts) {
      var b, bl, br, dX, dY, h, index, inputImageData, l, outputImageData, r, rowLen, t, tl, tr, w, x, y, _i, _j, _ref2, _ref3;
      NormalAction.__super__.render.call(this);
      inputImageData = contexts[0].getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      outputImageData = this.context.getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      w = this.app.getWidth();
      h = this.app.getHeight();
      for (y = _i = 1, _ref2 = h - 1; 1 <= _ref2 ? _i < _ref2 : _i > _ref2; y = 1 <= _ref2 ? ++_i : --_i) {
        for (x = _j = 1, _ref3 = w - 1; 1 <= _ref3 ? _j < _ref3 : _j > _ref3; x = 1 <= _ref3 ? ++_j : --_j) {
          rowLen = w << 2;
          index = (x << 2) + y * rowLen;
          tl = inputImageData.data[index - rowLen - 4];
          l = inputImageData.data[index - 4];
          bl = inputImageData.data[index + rowLen - 4];
          t = inputImageData.data[index - rowLen];
          b = inputImageData.data[index + rowLen];
          tr = inputImageData.data[index - rowLen + 4];
          r = inputImageData.data[index + 4];
          br = inputImageData.data[index + rowLen - 4];
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
