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

    Action.prototype.validations = function() {
      return {};
    };

    Action.prototype.copyRendered = function(contexts) {
      var imageData;
      if (contexts.length === 0) {
        this.context.fillStyle = 'black';
        return this.context.fillRect(0, 0, this.app.getWidth(), this.app.getHeight());
      } else {
        imageData = contexts[0].getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
        return this.context.putImageData(imageData, 0, 0);
      }
    };

    Action.prototype.doRender = function(contexts) {
      var valid, _ref1, _ref2;
      valid = this.validations(contexts);
      if (((_ref1 = valid.warnings) != null ? _ref1.length : void 0) > 0) {
        this.app.displayWarnings(this, valid.warnings);
      } else {
        this.app.removeWarnings(this);
      }
      if (((_ref2 = valid.errors) != null ? _ref2.length : void 0) > 0) {
        this.app.displayErrors(this, valid.errors);
        return false;
      } else {
        this.app.removeErrors(this);
      }
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
      this.app.updateParentsRecursively(this);
      return this.setCaption(this.caption());
    };

    Action.prototype.setCaption = function(caption) {
      return this.element.find('.wrapper').contents().first().get(0).data = caption || this.caption();
    };

    Action.prototype.caption = function() {
      return this.name;
    };

    return Action;

  })();

}).call(this);
