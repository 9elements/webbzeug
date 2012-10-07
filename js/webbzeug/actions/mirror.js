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

    MirrorAction.prototype.availableParameters = function() {
      return {
        direction: {
          name: "Direction",
          type: 'enum',
          values: {
            vertical: 'Vertical',
            horizontal: 'Horizontal'
          },
          "default": 'vertical'
        }
      };
    };

    MirrorAction.prototype.render = function(contexts) {
      var imageData, x, y, yDrawOffset, ySrcOffset, _i, _j, _ref2, _ref3;
      MirrorAction.__super__.render.call(this);
      if (contexts.length === 0) {
        console.log("Dude a mirror needs an input");
        return;
      }
      imageData = contexts[0].getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      console.log(this.getParameter('direction'));
      if (this.getParameter('direction') === 'horizontal') {
        for (y = _i = 0, _ref2 = imageData.height; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; y = 0 <= _ref2 ? ++_i : --_i) {
          ySrcOffset = (y * imageData.width) << 2 + (x << 2);
          yDrawOffset = (y * imageData.width + imageData.width - 1) << 2 - (x << 2);
          for (x = _j = 0, _ref3 = imageData.width / 2; 0 <= _ref3 ? _j < _ref3 : _j > _ref3; x = 0 <= _ref3 ? ++_j : --_j) {
            imageData.data[yDrawOffset] = imageData.data[ySrcOffset];
            imageData.data[yDrawOffset + 1] = imageData.data[ySrcOffset + 1];
            imageData.data[yDrawOffset + 2] = imageData.data[ySrcOffset + 2];
            imageData.data[yDrawOffset + 3] = imageData.data[ySrcOffset + 3];
          }
        }
      }
      this.context.putImageData(imageData, 0, 0);
      return this.context;
    };

    return MirrorAction;

  })(Webbzeug.Action);

}).call(this);
