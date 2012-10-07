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
      var h, index, inputImageData, outputImageData, rowLen, vector1X, vector1Y, vector1Z, vector2X, vector2Y, vector2Z, vector3X, vector3Y, vector3Z, w, x, y, _i, _j, _ref2, _ref3;
      NormalAction.__super__.render.call(this);
      inputImageData = contexts[0].getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      outputImageData = this.context.getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      w = this.app.getWidth();
      h = this.app.getHeight();
      for (y = _i = 0, _ref2 = h - 1; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; y = 0 <= _ref2 ? ++_i : --_i) {
        for (x = _j = 0, _ref3 = w - 1; 0 <= _ref3 ? _j < _ref3 : _j > _ref3; x = 0 <= _ref3 ? ++_j : --_j) {
          rowLen = w << 2;
          index = (x << 2) + y * rowLen;
          vector1X = inputImageData.data[index] - inputImageData.data[index + 4];
          vector1Y = inputImageData.data[index + 1] - inputImageData.data[index + 5];
          vector1Z = inputImageData.data[index + 2] - inputImageData.data[index + 6];
          vector2X = inputImageData.data[index] - inputImageData.data[index + rowLen];
          vector2Y = inputImageData.data[index + 1] - inputImageData.data[index + rowLen + 1];
          vector2Z = inputImageData.data[index + 2] - inputImageData.data[index + rowLen + 2];
          vector3X = vector1Y * vector2Z - vector1Z * vector2Y;
          vector3Y = vector1Z * vector2X - vector1X * vector2Z;
          vector3Z = vector1X * vector2Y - vector1Y * vector2X;
          outputImageData.data[index] = (vector3X + 255) / 2;
          outputImageData.data[index + 1] = (vector3Y + 255) / 2;
          outputImageData.data[index + 2] = (vector3Z + 255) / 2;
          outputImageData.data[index + 3] = 255;
        }
      }
      this.context.putImageData(outputImageData, 0, 0);
      return this.context;
    };

    return NormalAction;

  })(Webbzeug.Action);

}).call(this);
