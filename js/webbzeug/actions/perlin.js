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
        },
        next01: function() {
          return this.next() / maximum;
        }
    }
};

  var PerlinAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Perlin = PerlinAction = (function(_super) {

    __extends(PerlinAction, _super);

    function PerlinAction() {
      return PerlinAction.__super__.constructor.apply(this, arguments);
    }

    PerlinAction.prototype.type = 'perlin';

    PerlinAction.prototype.name = 'Perlin';

    PerlinAction.prototype.unitSize = 1;

    PerlinAction.prototype.availableParameters = function() {
      return {
        roughness: {
          name: 'Roughness',
          type: 'integer',
          min: 1,
          max: 100,
          "default": 3,
          scrollPrecision: 1
        },
        seed: {
          name: 'Seed',
          type: 'integer',
          min: 1,
          max: 255,
          "default": Math.round(Math.random() * 255),
          scrollPrecision: 1
        }
      };
    };

    PerlinAction.prototype.validations = function(contexts) {
      var warnings;
      warnings = [];
      if (contexts.length > 1) {
        warnings.push('Fractal will only use the first input.');
      }
      return {
        warnings: warnings
      };
    };

    PerlinAction.prototype.render = function(inputs) {
      var fractalTexture;
      PerlinAction.__super__.render.call(this);
      if (!(this.canvas != null)) {
        this.createCanvas();
      }
      this.createPatternOnCanvas();
      fractalTexture = new THREE.Texture(this.canvas);
      fractalTexture.needsUpdate = true;
      this.fractalMaterial = new THREE.MeshBasicMaterial({
        map: fractalTexture
      });
      this.screenAlignedQuadMesh.material = this.fractalMaterial;
      this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, this.renderTarget, true);
      return this.renderTarget;
    };

    PerlinAction.prototype.createPatternOnCanvas = function() {
      var h, imageData, imagePixelData, map, roughness, w, x, _i, _ref2;
      this.rnd = CustomRandom(this.getParameter('seed'));
      roughness = this.getParameter('roughness') / this.app.getWidth();
      imageData = this.context.getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      imagePixelData = imageData.data;
      w = this.app.getWidth();
      h = this.app.getHeight();
      map = [];
      for (x = _i = 0, _ref2 = w + 1; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; x = 0 <= _ref2 ? ++_i : --_i) {
        map[x] = [];
      }
      return this.rnd.next01();
    };

    return PerlinAction;

  })(Webbzeug.Action);

}).call(this);
