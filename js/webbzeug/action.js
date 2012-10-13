(function() {
  var Action, _ref;

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  window.Webbzeug.Action = Action = (function() {

    Action.prototype.width = 3;

    function Action(app, x, y, width, index) {
      var info, parameter, _ref1;
      this.app = app;
      this.x = x;
      this.y = y;
      this.width = width;
      this.index = index;
      this.children = [];
      this.parent = null;
      this.updatedAt = +new Date();
      this.renderedAt = 0;
      this.parameters = {};
      _ref1 = this.availableParameters();
      for (parameter in _ref1) {
        info = _ref1[parameter];
        this.parameters[parameter] = info["default"];
      }
    }

    Action.prototype.availableParameters = function() {
      return {};
    };

    Action.prototype.doRender = function(contexts) {
      if (this.willRender()) {
        this.render(contexts);
      }
      return this.context;
    };

    Action.prototype.render = function(contexts) {
      this.renderedAt = +new Date();
      this.canvas = $('<canvas>').get(0);
      this.canvas.width = this.app.getWidth();
      this.canvas.height = this.app.getHeight();
      return this.context = this.canvas.getContext('2d');
    };

    Action.prototype.willRender = function() {
      return this.updatedAt > this.renderedAt;
    };

    Action.prototype.deleteChildren = function() {
      return this.children = [];
    };

    Action.prototype.addChild = function(child) {
      return this.children.push(child);
    };

    Action.prototype.getParameter = function(parameter) {
      return this.parameters[parameter];
    };

    Action.prototype.setParameter = function(parameter, value) {
      this.parameters[parameter] = value;
      this.updatedAt = +new Date();
      this.app.buildTree();
      return this.app.updateParentsRecursively(this);
    };

    return Action;

  })();

}).call(this);
