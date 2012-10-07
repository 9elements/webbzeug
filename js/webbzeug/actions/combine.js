(function() {
  var CombineAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Combine = CombineAction = (function(_super) {

    __extends(CombineAction, _super);

    function CombineAction() {
      return CombineAction.__super__.constructor.apply(this, arguments);
    }

    CombineAction.prototype.type = 'combine';

    CombineAction.prototype.availableParameters = function() {
      return {
        type: {
          name: 'Type',
          type: 'enum',
          values: {
            multiply: 'Multiply',
            add: 'Add',
            substract: 'Substract',
            divide: 'Divide'
          },
          "default": 'addition'
        }
      };
    };

    CombineAction.prototype.render = function(contexts) {
      var applyingContext, i, imageData, _i, _ref2;
      CombineAction.__super__.render.call(this);
      if (contexts.length < 2) {
        console.log('A combine needs at least 2 inputs!');
        return false;
      }
      imageData = contexts[0].getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      this.context.putImageData(imageData, 0, 0);
      for (i = _i = 1, _ref2 = contexts.length; 1 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 1 <= _ref2 ? ++_i : --_i) {
        applyingContext = contexts[i];
        switch (this.getParameter('type')) {
          case 'multiply':
            this.multiply(applyingContext);
            break;
          case 'add':
            this.add(applyingContext);
            break;
          case 'substract':
            this.substract(applyingContext);
        }
      }
      return this.context;
    };

    CombineAction.prototype.multiply = function(applyingContext) {
      var applyingImageData, i, imageData, _i, _ref2;
      imageData = this.context.getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      applyingImageData = applyingContext.getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      for (i = _i = 0, _ref2 = applyingImageData.data.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
        imageData.data[i] = Math.round(applyingImageData.data[i] * imageData.data[i] / 255);
      }
      return this.context.putImageData(imageData, 0, 0);
    };

    CombineAction.prototype.add = function(applyingContext) {
      var applyingImageData, i, imageData, _i, _ref2;
      imageData = this.context.getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      applyingImageData = applyingContext.getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      for (i = _i = 0, _ref2 = applyingImageData.data.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
        imageData.data[i] = Math.min(applyingImageData.data[i] + imageData.data[i], 255);
      }
      return this.context.putImageData(imageData, 0, 0);
    };

    CombineAction.prototype.substract = function(applyingContext) {
      var applyingImageData, i, imageData, j, _i, _j, _ref2;
      imageData = this.context.getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      applyingImageData = applyingContext.getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      for (i = _i = 0, _ref2 = applyingImageData.data.length; _i < _ref2; i = _i += 4) {
        for (j = _j = 0; _j < 3; j = ++_j) {
          imageData.data[i + j] = imageData.data[i + j] - applyingImageData.data[i + j];
        }
      }
      return this.context.putImageData(imageData, 0, 0);
    };

    CombineAction.prototype.divide = function(applyingContext) {
      var applyingImageData, i, imageData, _i, _ref2;
      imageData = this.context.getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      applyingImageData = applyingContext.getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      for (i = _i = 0, _ref2 = applyingImageData.data.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
        if (imageData.data[i] > 0) {
          imageData.data[i] = Math.round(applyingImageData.data[i] / imageData.data[i]);
        }
      }
      return this.context.putImageData(imageData, 0, 0);
    };

    return CombineAction;

  })(Webbzeug.Action);

}).call(this);
