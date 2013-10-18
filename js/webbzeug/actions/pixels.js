(function() {
  var CustomRandom = function(nseed) {

    var seed,
        constant = Math.pow(2, 13)+1,
        prime = 37,
        maximum = Math.pow(2, 50);

    if (nseed) {
        seed = nseed;
    }

    if (seed == null) {
        seed = (new Date()).getTime();
    }

    return {
        next : function() {
            seed *= constant;
            seed += prime;
            seed %= maximum;

            return seed;
        }
    }
};
  var PixelsAction, _base, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (window.Webbzeug == null) {
    window.Webbzeug = {};
  }

  if ((_base = window.Webbzeug).Actions == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Pixels = PixelsAction = (function(_super) {
    __extends(PixelsAction, _super);

    function PixelsAction() {
      _ref = PixelsAction.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PixelsAction.prototype.type = 'pixels';

    PixelsAction.prototype.name = 'Pixels';

    PixelsAction.prototype.canvas = null;

    PixelsAction.prototype.availableParameters = function() {
      return {
        seed: {
          name: 'Seed',
          type: 'integer',
          min: 0,
          max: 255,
          "default": Math.round(Math.random() * 255),
          scrollPrecision: 1
        },
        amount: {
          name: 'Amount',
          type: 'integer',
          min: 1,
          max: 17,
          "default": 1,
          scrollPrecision: 1
        }
      };
    };

    PixelsAction.prototype.validations = function(contexts) {
      var warnings;
      warnings = [];
      if (contexts.length > 1) {
        warnings.push('Pixels will only use the first input.');
      }
      return {
        warnings: warnings
      };
    };

    PixelsAction.prototype.clearCanvas = function(imageData) {
      var i, index, _i, _ref1, _results;
      _results = [];
      for (i = _i = 0, _ref1 = imageData.data.length / 4; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
        index = i * 4;
        imageData.data[index] = 0;
        imageData.data[index + 1] = 0;
        imageData.data[index + 2] = 0;
        _results.push(imageData.data[index + 3] = 255);
      }
      return _results;
    };

    PixelsAction.prototype.createPatternOnCanvas = function() {
      var custRnd, height, i, imageData, index, pixelCount, rand, randomNormalizer, width, x, y, _i;
      randomNormalizer = Math.pow(2, 50);
      imageData = this.context.getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      pixelCount = Math.pow(2, this.getParameter('amount'));
      custRnd = CustomRandom(this.getParameter('seed'));
      width = this.app.getWidth();
      height = this.app.getHeight();
      this.clearCanvas(imageData);
      for (i = _i = 0; 0 <= pixelCount ? _i < pixelCount : _i > pixelCount; i = 0 <= pixelCount ? ++_i : --_i) {
        rand = custRnd.next() / randomNormalizer;
        rand = rand * 255;
        x = Math.round(custRnd.next() / randomNormalizer * width);
        y = Math.round(custRnd.next() / randomNormalizer * height);
        index = x * 4 + y * 4 * width;
        imageData.data[index] = rand;
        imageData.data[index + 1] = rand;
        imageData.data[index + 2] = rand;
      }
      this.context.putImageData(imageData, 0, 0);
      return this.context;
    };

    PixelsAction.prototype.render = function(inputs) {
      var cellTexture;
      PixelsAction.__super__.render.call(this);
      if (this.canvas == null) {
        this.createCanvas();
      }
      this.createPatternOnCanvas();
      cellTexture = new THREE.Texture(this.canvas);
      cellTexture.needsUpdate = true;
      this.cellMaterial = new THREE.MeshBasicMaterial({
        map: cellTexture
      });
      this.screenAlignedQuadMesh.material = this.cellMaterial;
      this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, this.renderTarget, true);
      return this.renderTarget;
    };

    return PixelsAction;

  })(Webbzeug.Action);

}).call(this);
