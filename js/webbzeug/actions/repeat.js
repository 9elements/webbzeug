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

    RepeatAction.prototype.type = 'processive';

    RepeatAction.prototype.name = 'Repeat';

    RepeatAction.prototype.availableParameters = function() {
      return {
        scrollX: {
          name: 'Scroll X',
          type: 'number',
          min: -256,
          max: 256,
          "default": 0,
          step: 1
        },
        scrollY: {
          name: 'Scroll Y',
          type: 'number',
          min: -256,
          max: 256,
          "default": 0,
          step: 1
        },
        count: {
          name: 'Count',
          type: 'number',
          min: 1,
          max: 50,
          "default": 1
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
      scrollX = scrollXinc;
      scrollY = scrollYinc;
      for (i = _i = 0, _ref2 = parseInt(this.getParameter('count')); 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
        for (x = _j = 0; 0 <= w ? _j < w : _j > w; x = 0 <= w ? ++_j : --_j) {
          for (y = _k = 0; 0 <= h ? _k < h : _k > h; y = 0 <= h ? ++_k : --_k) {
            srcX = x;
            srcY = y;
            destX = x + scrollX;
            destY = y + scrollY;
            if (destY < 0) {
              destY += Math.ceil(Math.abs(destY) / h) * h;
            }
            if (destY > h - 1) {
              destY -= Math.ceil(destY / h) * h;
            }
            if (destX < 0) {
              destX += Math.ceil(Math.abs(destX) / w) * w;
            }
            if (destX > w - 1) {
              destX -= Math.ceil(destX / w) * w;
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
          }
        }
        scrollX += scrollXinc;
        scrollY += scrollYinc;
      }
      this.context.putImageData(outputData, 0, 0);
      return this.context;
    };

    return RepeatAction;

  })(Webbzeug.Action);

}).call(this);
