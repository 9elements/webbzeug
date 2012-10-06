(function() {
  var PixelsAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Pixels = PixelsAction = (function(_super) {

    __extends(PixelsAction, _super);

    function PixelsAction() {
      return PixelsAction.__super__.constructor.apply(this, arguments);
    }

    PixelsAction.prototype.render = function(contexts) {
      var i, imageData, index, rand, _i, _ref2;
      PixelsAction.__super__.render.call(this);
      imageData = this.context.getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      for (i = _i = 0, _ref2 = imageData.data.length / 4; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
        rand = Math.random();
        rand = rand * 255;
        index = i << 2;
        imageData.data[index] = rand;
        imageData.data[index + 1] = rand;
        imageData.data[index + 2] = rand;
        imageData.data[index + 3] = rand;
      }
      this.context.putImageData(imageData, 0, 0);
      return this.context;
    };

    return PixelsAction;

  })(Webbzeug.Action);

}).call(this);
