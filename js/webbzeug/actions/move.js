(function() {
  var MoveAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Move = MoveAction = (function(_super) {

    __extends(MoveAction, _super);

    function MoveAction() {
      return MoveAction.__super__.constructor.apply(this, arguments);
    }

    MoveAction.prototype.type = 'move';

    MoveAction.prototype.name = 'Move';

    MoveAction.prototype.availableParameters = function() {
      return {
        scrollX: {
          name: 'Scroll X',
          type: 'integer',
          min: -256,
          max: 256,
          "default": 0,
          step: 1,
          scrollPrecision: 1
        },
        scrollY: {
          name: 'Scroll Y',
          type: 'integer',
          min: -256,
          max: 256,
          "default": 0,
          step: 1,
          scrollPrecision: 1
        }
      };
    };

    MoveAction.prototype.validations = function(contexts) {
      var errors, warnings;
      warnings = [];
      errors = [];
      if (contexts.length > 1) {
        warnings.push('Move will only use the first input.');
      }
      if (contexts.length < 1) {
        errors.push('Move needs exactly one input.');
      }
      return {
        errors: errors,
        warnings: warnings
      };
    };

    MoveAction.prototype.render = function(contexts) {
      var destIndex, destX, destY, h, inputData, outputData, scrollX, scrollY, srcIndex, srcX, srcY, w, x, y, _i, _j;
      MoveAction.__super__.render.call(this);
      this.copyRendered(contexts);
      w = this.app.getWidth();
      h = this.app.getHeight();
      inputData = contexts[0].getImageData(0, 0, w, h);
      outputData = this.context.getImageData(0, 0, w, h);
      scrollX = parseInt(this.getParameter('scrollX'));
      scrollY = parseInt(this.getParameter('scrollY'));
      for (x = _i = 0; 0 <= w ? _i < w : _i > w; x = 0 <= w ? ++_i : --_i) {
        for (y = _j = 0; 0 <= h ? _j < h : _j > h; y = 0 <= h ? ++_j : --_j) {
          srcX = x;
          srcY = y;
          destX = (srcX + scrollX) % w;
          destY = (srcY + scrollY) % h;
          if (destX < 0) {
            destX += w;
          }
          if (destY < 0) {
            destY += h;
          }
          srcIndex = ((srcY * w) + srcX) << 2;
          destIndex = ((destY * w) + destX) << 2;
          outputData.data[destIndex] = inputData.data[srcIndex];
          outputData.data[destIndex + 1] = inputData.data[srcIndex + 1];
          outputData.data[destIndex + 2] = inputData.data[srcIndex + 2];
          outputData.data[destIndex + 3] = inputData.data[srcIndex + 3];
        }
      }
      this.context.putImageData(outputData, 0, 0);
      return this.context;
    };

    return MoveAction;

  })(Webbzeug.Action);

}).call(this);
