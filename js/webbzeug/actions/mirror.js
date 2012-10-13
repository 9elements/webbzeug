(function() {
  var MirrorAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Mirror = MirrorAction = (function(_super) {

    __extends(MirrorAction, _super);

    function MirrorAction() {
      return MirrorAction.__super__.constructor.apply(this, arguments);
    }

    MirrorAction.prototype.type = 'mirror';

    MirrorAction.prototype.availableParameters = function() {
      return {
        direction: {
          name: "Direction",
          type: 'enum',
          values: {
            vertical: 'Vertical',
            horizontal: 'Horizontal'
          },
          "default": 'horizontal'
        }
      };
    };

    MirrorAction.prototype.validations = function(contexts) {
      var errors, warnings;
      errors = [];
      warnings = [];
      if (contexts.length > 1) {
        warnings.push('Mirror will only use the first input.');
      }
      if (contexts.length < 1) {
        errors.push('Mirror needs exactly 1 input.');
      }
      return {
        errors: errors,
        warnings: warnings
      };
    };

    MirrorAction.prototype.render = function(contexts) {
      var destIndex, imageData, srcIndex, x, y, _i, _j, _k, _l, _ref2, _ref3, _ref4, _ref5;
      MirrorAction.__super__.render.call(this);
      imageData = contexts[0].getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      if (this.getParameter('direction') === 'horizontal') {
        for (y = _i = 0, _ref2 = imageData.height; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; y = 0 <= _ref2 ? ++_i : --_i) {
          for (x = _j = 0, _ref3 = imageData.width / 2; 0 <= _ref3 ? _j < _ref3 : _j > _ref3; x = 0 <= _ref3 ? ++_j : --_j) {
            srcIndex = ((y * imageData.width) << 2) + (x << 2);
            destIndex = (((y + 1) * imageData.width - 1) << 2) - (x << 2);
            imageData.data[destIndex] = imageData.data[srcIndex];
            imageData.data[destIndex + 1] = imageData.data[srcIndex + 1];
            imageData.data[destIndex + 2] = imageData.data[srcIndex + 2];
            imageData.data[destIndex + 3] = imageData.data[srcIndex + 3];
          }
        }
      } else {
        for (y = _k = 0, _ref4 = imageData.height / 2; 0 <= _ref4 ? _k < _ref4 : _k > _ref4; y = 0 <= _ref4 ? ++_k : --_k) {
          for (x = _l = 0, _ref5 = imageData.width; 0 <= _ref5 ? _l < _ref5 : _l > _ref5; x = 0 <= _ref5 ? ++_l : --_l) {
            srcIndex = ((y * imageData.width) << 2) + (x << 2);
            destIndex = (((imageData.height - y) * imageData.width) << 2) + (x << 2);
            imageData.data[destIndex] = imageData.data[srcIndex];
            imageData.data[destIndex + 1] = imageData.data[srcIndex + 1];
            imageData.data[destIndex + 2] = imageData.data[srcIndex + 2];
            imageData.data[destIndex + 3] = imageData.data[srcIndex + 3];
          }
        }
      }
      this.context.putImageData(imageData, 0, 0);
      return this.context;
    };

    return MirrorAction;

  })(Webbzeug.Action);

}).call(this);
