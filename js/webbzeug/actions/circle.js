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

    CircleAction.prototype.type = 'circle';

    CircleAction.prototype.name = 'Circle';

    CircleAction.prototype.availableParameters = function() {
      return {
        x: {
          name: 'X',
          type: 'integer',
          min: 0,
          max: 255,
          "default": 128,
          scrollPrecision: 1
        },
        y: {
          name: 'Y',
          type: 'integer',
          min: 0,
          max: 255,
          "default": 128,
          scrollPrecision: 1
        },
        radiusX: {
          name: 'Radius X',
          type: 'integer',
          min: 0,
          max: 256,
          "default": 50,
          scrollPrecision: 1
        },
        color: {
          name: 'Color',
          type: 'color',
          "default": 'rgba(255,0,0,1)'
        }
      };
    };

    CircleAction.prototype.validations = function(contexts) {
      var warnings;
      warnings = [];
      if (contexts.length > 1) {
        warnings.push('Circle will only use the first input.');
      }
      return {
        warnings: warnings
      };
    };

    CircleAction.prototype.render = function(contexts) {
      CircleAction.__super__.render.call(this);
      this.copyRendered(contexts);
      this.context.beginPath();
      this.context.arc(this.getParameter('x'), this.getParameter('y'), this.getParameter('radiusX'), 0, 2 * Math.PI, false);
      this.context.closePath();
      this.context.fillStyle = this.getParameter('color');
      this.context.fill();
      return this.context;
    };

    return CircleAction;

  })(Webbzeug.Action);

}).call(this);
