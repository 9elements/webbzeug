(function() {
  var CircleAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Circle = CircleAction = (function(_super) {

    __extends(CircleAction, _super);

    function CircleAction() {
      return CircleAction.__super__.constructor.apply(this, arguments);
    }

    CircleAction.prototype.render = function(contexts) {
      var imageData;
      CircleAction.__super__.render.call(this);
      if (contexts.length === 0) {
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.app.getWidth(), this.app.getHeight());
      } else {
        imageData = contexts[0].getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
        this.context.putImageData(imageData, 0, 0);
        console.log(imageData.data);
      }
      this.context.beginPath();
      this.context.arc(100, 100, 100, 100, 2 * Math.PI, false);
      this.context.stroke();
      this.context.strokeStyle = 'rgba(255,40,20,0.7)';
      this.context.closePath();
      this.context.fillStyle = 'blue';
      this.context.fill();
      return this.context;
    };

    return CircleAction;

  })(Webbzeug.Action);

}).call(this);
