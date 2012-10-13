(function() {
  var MaskAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Mask = MaskAction = (function(_super) {

    __extends(MaskAction, _super);

    function MaskAction() {
      return MaskAction.__super__.constructor.apply(this, arguments);
    }

    MaskAction.prototype.type = 'processive';

    MaskAction.prototype.name = 'Mask';

    MaskAction.prototype.availableParameters = function() {
      return {};
    };

    MaskAction.prototype.validations = function(contexts) {
      var errors, warnings;
      errors = [];
      warnings = [];
      if (contexts.length > 3) {
        warnings.push('Mask will only use the first 3 inputs.');
      }
      if (contexts.length < 3) {
        errors.push('Mask needs exactly 3 inputs.');
      }
      return {
        warnings: warnings
      };
    };

    MaskAction.prototype.render = function(contexts) {
      var avg, bd, gd, i, imageData, imgA, imgB, index, maskData, rd, _i, _ref2;
      MaskAction.__super__.render.call(this);
      if (contexts.length !== 3) {
        console.log("Dude a mask needs three inputs");
        return false;
      }
      maskData = contexts[0].getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      imgA = contexts[1].getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      imgB = contexts[2].getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      imageData = this.context.getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      imageData[0] = 255;
      for (i = _i = 0, _ref2 = imageData.data.length / 4; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
        index = i << 2;
        avg = Math.floor((maskData.data[index] + maskData.data[index + 1] + maskData.data[index + 2]) / 3);
        rd = imgB.data[index] - imgA.data[index];
        gd = imgB.data[index + 1] - imgA.data[index + 1];
        bd = imgB.data[index + 2] - imgA.data[index + 2];
        imageData.data[index] = imgA.data[index] + (rd * (avg / 255));
        imageData.data[index + 1] = imgA.data[index + 1] + (gd * (avg / 255));
        imageData.data[index + 2] = imgA.data[index + 2] + (bd * (avg / 255));
        imageData.data[index + 3] = 255;
      }
      this.context.putImageData(imageData, 0, 0);
      return this.context;
    };

    return MaskAction;

  })(Webbzeug.Action);

}).call(this);
