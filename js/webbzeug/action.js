(function() {
  var Action, _ref;

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  window.Webbzeug.Action = Action = (function() {

    Action.prototype.width = 3;

    function Action(app, x, y, index) {
      this.app = app;
      this.x = x;
      this.y = y;
      this.index = index;
      this.children = [];
    }

    Action.prototype.availableOptions = function() {
      return {};
    };

    Action.prototype.render = function(contexts) {
      console.log("rendering...", this.index, ":", this.constructor.name, "x", this.x, "y", this.y);
      this.canvas = $('<canvas>').get(0);
      this.canvas.width = this.app.getWidth();
      this.canvas.height = this.app.getHeight();
      return this.context = this.canvas.getContext('2d');
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
