(function() {
  var RepeatAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Repeat = RepeatAction = (function(_super) {

    __extends(RepeatAction, _super);

    function RepeatAction() {
      return RepeatAction.__super__.constructor.apply(this, arguments);
    }

    RepeatAction.prototype.type = 'repeat';

    RepeatAction.prototype.name = 'Repeat';

    RepeatAction.prototype.availableParameters = function() {
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
        },
        count: {
          name: 'Count',
          type: 'integer',
          min: 1,
          max: 50,
          "default": 1,
          scrollPrecision: 1
        },
        blendmode: {
          name: 'Blend Mode',
          type: 'enum',
          values: {
            add: 'Add'
          },
          "default": 'add'
        }
      };
    };

    RepeatAction.prototype.validations = function(contexts) {
      var errors, warnings;
      warnings = [];
      errors = [];
      if (contexts.length > 1) {
        warnings.push('Repeat will only use the first input.');
      }
      if (contexts.length < 1) {
        errors.push('Repeat needs exactly one input.');
      }
      return {
        errors: errors,
        warnings: warnings
      };
    };

    RepeatAction.prototype.render = function(contexts) {
      var destIndex, destX, destY, h, i, inputData, outputData, scrollX, scrollXinc, scrollY, scrollYinc, srcIndex, srcX, srcY, w, x, y, _i, _j, _k, _ref2;
      RepeatAction.__super__.render.call(this);
      this.copyRendered(contexts);
      w = this.app.getWidth();
      h = this.app.getHeight();
      inputData = contexts[0].getImageData(0, 0, w, h);
      outputData = this.context.getImageData(0, 0, w, h);
      scrollXinc = parseInt(this.getParameter('scrollX'));
      scrollYinc = parseInt(this.getParameter('scrollY'));
      for (x = _i = 0; 0 <= w ? _i < w : _i > w; x = 0 <= w ? ++_i : --_i) {
        for (y = _j = 0; 0 <= h ? _j < h : _j > h; y = 0 <= h ? ++_j : --_j) {
          scrollX = scrollXinc;
          scrollY = scrollYinc;
          for (i = _k = 0, _ref2 = parseInt(this.getParameter('count')); 0 <= _ref2 ? _k < _ref2 : _k > _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
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
            switch (this.getParameter('blendmode')) {
              case 'add':
                outputData.data[destIndex] = Math.min(outputData.data[destIndex] + inputData.data[srcIndex], 255);
                outputData.data[destIndex + 1] = Math.min(outputData.data[destIndex + 1] + inputData.data[srcIndex + 1], 255);
                outputData.data[destIndex + 2] = Math.min(outputData.data[destIndex + 2] + inputData.data[srcIndex + 2], 255);
                outputData.data[destIndex + 3] = Math.min(outputData.data[destIndex + 3] + inputData.data[srcIndex + 3], 255);
            }
            scrollX += scrollXinc;
            scrollY += scrollYinc;
          }
        }
      }
      this.context.putImageData(outputData, 0, 0);
      return this.context;
    };

    return RepeatAction;

  })(Webbzeug.Action);

}).call(this);
