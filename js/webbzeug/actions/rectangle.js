(function() {
  var RectangleAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Rectangle = RectangleAction = (function(_super) {

    __extends(RectangleAction, _super);

    function RectangleAction() {
      return RectangleAction.__super__.constructor.apply(this, arguments);
    }

    RectangleAction.prototype.type = 'rect';

    RectangleAction.prototype.name = 'Rect';

    RectangleAction.prototype.availableParameters = function() {
      return {
        x: {
          name: 'X',
          type: 'integer',
          min: 0,
          max: 255,
          "default": 64,
          scrollPrecision: 1
        },
        y: {
          name: 'Y',
          type: 'integer',
          min: 0,
          max: 255,
          "default": 64,
          scrollPrecision: 1
        },
        width: {
          name: 'Width',
          type: 'integer',
          min: 0,
          max: 255,
          "default": 128,
          scrollPrecision: 1
        },
        height: {
          name: 'Height',
          type: 'integer',
          min: 0,
          max: 255,
          "default": 128,
          scrollPrecision: 1
        },
        color: {
          name: 'Color',
          type: 'color',
          "default": 'rgba(255,255,255,1)'
        }
      };
    };

    RectangleAction.prototype.validations = function(contexts) {
      var warnings;
      warnings = [];
      if (contexts.length > 1) {
        warnings.push('Rectangle will only use the first input.');
      }
      return {
        warnings: warnings
      };
    };

    RectangleAction.prototype.render = function(contexts) {
      var h, w, x, y;
      RectangleAction.__super__.render.call(this);
      x = this.getParameter('x');
      y = this.getParameter('y');
      w = this.getParameter('width');
      h = this.getParameter('height');
      this.copyRendered(contexts);
      this.context.fillStyle = this.getParameter('color');
      this.context.fillRect(x, y, w, h);
      return this.context;
    };

    return RectangleAction;

  })(Webbzeug.Action);

}).call(this);
