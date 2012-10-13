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

    FlatAction.prototype.type = 'generative';

    FlatAction.prototype.name = 'Flat';

    FlatAction.prototype.availableParameters = function() {
      return {
        color: {
          name: 'Color',
          type: 'color',
          "default": 'rgba(255,0,0,1)'
        }
      };
    };

    FlatAction.prototype.validations = function(contexts) {
      var warnings;
      warnings = [];
      if (contexts.length > 1) {
        warnings.push('Flat will only use the first input.');
      }
      return {
        warnings: warnings
      };
    };

    FlatAction.prototype.render = function(contexts) {
      FlatAction.__super__.render.call(this);
      this.context.fillStyle = this.getParameter('color');
      this.context.fillRect(0, 0, this.app.getWidth(), this.app.getHeight());
      return this.context;
    };

    return FlatAction;

  })(Webbzeug.Action);

}).call(this);
