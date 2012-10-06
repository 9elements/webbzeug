(function() {
  var InvertAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Invert = InvertAction = (function(_super) {

    __extends(InvertAction, _super);

    function InvertAction() {
      return InvertAction.__super__.constructor.apply(this, arguments);
    }

    InvertAction.prototype.render = function(contexts) {
      var i, imageData, _i, _ref2;
      InvertAction.__super__.render.call(this);
      if (contexts.length === 0) {
        console.log("Dude an inverter needs an input");
        return;
      }
      imageData = contexts[0].getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      for (i = _i = 0, _ref2 = imageData.data.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
        if ((i % 4) !== 3) {
          imageData.data[i] = 255 - imageData.data[i];
        }
      }
      this.context.putImageData(imageData, 0, 0);
      return this.context;
    };

    return InvertAction;

  })(Webbzeug.Action);

}).call(this);
