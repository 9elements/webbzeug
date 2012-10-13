(function() {
  var BlurAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Blur = BlurAction = (function(_super) {

    __extends(BlurAction, _super);

    function BlurAction() {
      return BlurAction.__super__.constructor.apply(this, arguments);
    }

    BlurAction.prototype.type = 'blur';

    BlurAction.prototype.availableParameters = function() {
      return {
        strength: {
          name: 'Strength',
          type: 'number',
          "default": 1,
          min: 1,
          max: 30
        },
        type: {
          name: 'Type',
          type: 'enum',
          values: {
            linear: 'Linear',
            gauss: 'Gauss'
          },
          "default": 'linear'
        }
      };
    };

    BlurAction.prototype.validations = function(contexts) {
      var errors, warnings;
      warnings = [];
      errors = [];
      if (contexts.length > 1) {
        warnings.push('Blur will only use the first input.');
      }
      if (contexts.length < 1) {
        errors.push('Blur needs exactly 1 input.');
      }
      return {
        errors: errors,
        warnings: warnings
      };
    };

    BlurAction.prototype.linearBlur = function(contexts) {
      var i, imageData, index, n, outputData, pixelCount, rowLength, strength, value, x, y, _i, _j, _k, _l, _ref2, _ref3, _results;
      strength = parseInt(this.getParameter('strength'));
      _results = [];
      for (n = _i = 0; 0 <= strength ? _i < strength : _i > strength; n = 0 <= strength ? ++_i : --_i) {
        if (n === 0) {
          imageData = contexts[0].getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
        } else {
          imageData = this.context.getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
        }
        outputData = this.context.getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
        rowLength = this.app.getWidth() << 2;
        for (y = _j = 0, _ref2 = this.app.getHeight(); 0 <= _ref2 ? _j < _ref2 : _j > _ref2; y = 0 <= _ref2 ? ++_j : --_j) {
          for (x = _k = 0, _ref3 = this.app.getWidth(); 0 <= _ref3 ? _k < _ref3 : _k > _ref3; x = 0 <= _ref3 ? ++_k : --_k) {
            index = (x << 2) + y * (this.app.getWidth() << 2);
            for (i = _l = 0; _l < 3; i = ++_l) {
              pixelCount = 9;
              value = imageData.data[index + i];
              if (y !== 0) {
                value += imageData.data[index + i - rowLength];
                if (x !== 0) {
                  value += imageData.data[index + i - 4 - rowLength];
                } else {
                  pixelCount -= 1;
                }
                if (x < (this.app.getWidth() - 1)) {
                  value += imageData.data[index + i + 4 - rowLength];
                } else {
                  pixelCount -= 1;
                }
              } else {
                pixelCount -= 3;
              }
              if (x !== 0) {
                value += imageData.data[index + i - 4];
              } else {
                pixelCount -= 1;
              }
              if (x < (this.app.getWidth() - 1)) {
                value += imageData.data[index + i + 4];
              } else {
                pixelCount -= 1;
              }
              if (y < (this.app.getHeight() - 1)) {
                value += imageData.data[index + i + rowLength];
                if (x !== 0) {
                  value += imageData.data[index + i - 4 + rowLength];
                } else {
                  pixelCount -= 1;
                }
                if (x < (this.app.getWidth() - 1)) {
                  value += imageData.data[index + i + 4 + rowLength];
                } else {
                  pixelCount -= 1;
                }
              } else {
                pixelCount -= 3;
              }
              outputData.data[index + i] = value / pixelCount;
            }
            outputData.data[index + 3] = 255;
          }
        }
        _results.push(this.context.putImageData(outputData, 0, 0));
      }
      return _results;
    };

    BlurAction.prototype.gaussBlur = function(contexts) {
      var i, imageData, index, n, outputData, pixelCount, rowLength, strength, value, x, y, _i, _j, _k, _l, _ref2, _ref3, _results;
      strength = parseInt(this.getParameter('strength'));
      _results = [];
      for (n = _i = 0; 0 <= strength ? _i < strength : _i > strength; n = 0 <= strength ? ++_i : --_i) {
        if (n === 0) {
          imageData = contexts[0].getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
        } else {
          imageData = this.context.getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
        }
        outputData = this.context.getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
        rowLength = this.app.getWidth() << 2;
        for (y = _j = 0, _ref2 = this.app.getHeight(); 0 <= _ref2 ? _j < _ref2 : _j > _ref2; y = 0 <= _ref2 ? ++_j : --_j) {
          for (x = _k = 0, _ref3 = this.app.getWidth(); 0 <= _ref3 ? _k < _ref3 : _k > _ref3; x = 0 <= _ref3 ? ++_k : --_k) {
            index = (x << 2) + y * (this.app.getWidth() << 2);
            for (i = _l = 0; _l < 3; i = ++_l) {
              pixelCount = 16;
              value = imageData.data[index + i] << 2;
              if (y !== 0) {
                value += imageData.data[index + i - rowLength] << 1;
                if (x !== 0) {
                  value += imageData.data[index + i - 4 - rowLength];
                } else {
                  pixelCount -= 1;
                }
                if (x < (this.app.getWidth() - 1)) {
                  value += imageData.data[index + i + 4 - rowLength];
                } else {
                  pixelCount -= 1;
                }
              } else {
                pixelCount -= 4;
              }
              if (x !== 0) {
                value += imageData.data[index + i - 4] << 1;
              } else {
                pixelCount -= 2;
              }
              if (x < (this.app.getWidth() - 1)) {
                value += imageData.data[index + i + 4] << 1;
              } else {
                pixelCount -= 2;
              }
              if (y < (this.app.getHeight() - 1)) {
                value += imageData.data[index + i + rowLength] << 1;
                if (x !== 0) {
                  value += imageData.data[index + i - 4 + rowLength];
                } else {
                  pixelCount -= 1;
                }
                if (x < (this.app.getWidth() - 1)) {
                  value += imageData.data[index + i + 4 + rowLength];
                } else {
                  pixelCount -= 1;
                }
              } else {
                pixelCount -= 4;
              }
              outputData.data[index + i] = value / pixelCount;
            }
            outputData.data[index + 3] = 255;
          }
        }
        _results.push(this.context.putImageData(outputData, 0, 0));
      }
      return _results;
    };

    BlurAction.prototype.render = function(contexts) {
      BlurAction.__super__.render.call(this);
      switch (this.getParameter('type')) {
        case 'linear':
          this.linearBlur(contexts);
          break;
        case 'gauss':
          this.gaussBlur(contexts);
      }
      return this.context;
    };

    return BlurAction;

  })(Webbzeug.Action);

}).call(this);
