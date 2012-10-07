(function() {
  var ContrastBrightnessAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.ContrastBrightness = ContrastBrightnessAction = (function(_super) {

    __extends(ContrastBrightnessAction, _super);

    function ContrastBrightnessAction() {
      return ContrastBrightnessAction.__super__.constructor.apply(this, arguments);
    }

    ContrastBrightnessAction.prototype.availableParameters = function() {
      return {
        contrast: {
          name: "Contrast",
          type: 'number',
          min: 0,
          max: 255,
          "default": 127
        },
        brightness: {
          name: "Brightness",
          type: 'number',
          min: 0,
          max: 255,
          "default": 127
        }
      };
    };

    ContrastBrightnessAction.prototype.render = function(contexts) {
      var brightness, contrast, i, imageData, _i, _ref2;
      ContrastBrightnessAction.__super__.render.call(this);
      if (contexts.length === 0) {
        console.log("Dude an cont-bri needs an input");
        return;
      }
      contrast = this.getParameter('contrast');
      contrast = contrast / 128;
      brightness = this.getParameter('brightness') - 127;
      imageData = contexts[0].getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      for (i = _i = 0, _ref2 = imageData.data.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
        if ((i % 4) !== 3) {
          imageData.data[i] = imageData.data[i] * contrast;
          imageData.data[i] = imageData.data[i] + brightness;
          imageData.data[i] = Math.min(imageData.data[i], 255);
        }
      }
      this.context.putImageData(imageData, 0, 0);
      return this.context;
    };

    return ContrastBrightnessAction;

  })(Webbzeug.Action);

}).call(this);
