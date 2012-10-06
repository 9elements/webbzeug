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
      this.children = [];
    }

    Action.prototype.availableOptions = function() {
      return {};
    };

    Action.prototype.render = function() {
      return console.log(this.index, ":", this.constructor.name, "x", this.x, "y", this.y);
    };

    Action.prototype.deleteChildren = function() {
      return this.children = [];
    };

    Action.prototype.addChild = function(child) {
      return this.children.push(child);
    };

    return Action;

  })();

}).call(this);
