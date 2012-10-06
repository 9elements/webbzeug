(function() {
  var FlatAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Flat = FlatAction = (function(_super) {

    __extends(FlatAction, _super);

    function FlatAction() {
      return FlatAction.__super__.constructor.apply(this, arguments);
    }

    FlatAction.prototype.render = function() {
      var imageData;
      FlatAction.__super__.render.call(this);
      this.context.fillStyle = 'red';
      this.context.fillRect(0, 0, this.app.getWidth(), this.app.getHeight());
      imageData = this.context.getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      imageData.data[1] = 255;
      imageData.data[2] = 255;
      this.context.putImageData(imageData, 0, 0);
      return this.context;
    };

    return FlatAction;

  })(Webbzeug.Action);

}).call(this);
