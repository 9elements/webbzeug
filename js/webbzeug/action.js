(function() {
  var Action, _ref;

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  window.Webbzeug.Action = Action = (function() {

    Action.prototype.width = 3;

    function Action(x, y, index) {
      this.x = x;
      this.y = y;
      this.index = index;
      return;
    }

    Action.prototype.availableOptions = function() {
      return {};
    };

    Action.prototype.render = function() {
      return console.log(this.index, ":", this.constructor.name, "x", this.x, "y", this.y);
    };

    return Action;

  })();

}).call(this);
