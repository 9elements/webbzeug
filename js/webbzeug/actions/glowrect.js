(function() {
  var GlowrectAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Glowrect = GlowrectAction = (function(_super) {

    __extends(GlowrectAction, _super);

    function GlowrectAction() {
      return GlowrectAction.__super__.constructor.apply(this, arguments);
    }

    GlowrectAction.prototype.type = 'glowrect';

    GlowrectAction.prototype.name = 'GlowRect';

    GlowrectAction.prototype.availableParameters = function() {
      return {
        x: {
          name: 'X',
          type: 'integer',
          min: 0,
          max: 255,
          "default": 128,
          scrollPrecision: 1
        },
        y: {
          name: 'Y',
          type: 'integer',
          min: 0,
          max: 255,
          "default": 128,
          scrollPrecision: 1
        },
        width: {
          name: 'Width',
          type: 'integer',
          min: 1,
          max: 255,
          "default": 0,
          scrollPrecision: 1
        },
        height: {
          name: 'Height',
          type: 'integer',
          min: 1,
          max: 255,
          "default": 0,
          scrollPrecision: 1
        },
        radiusX: {
          name: 'Radius X',
          type: 'integer',
          min: 0,
          max: 255,
          "default": 30,
          scrollPrecision: 1
        },
        radiusY: {
          name: 'Radius Y',
          type: 'integer',
          min: 0,
          max: 255,
          "default": 30,
          scrollPrecision: 1
        },
        glow: {
          name: 'Glow',
          type: 'integer',
          min: 1,
          max: 100,
          "default": 1,
          scrollPrecision: 1
        },
        color: {
          name: 'Color',
          type: 'color',
          "default": 'rgba(255,255,255,1)'
        }
      };
    };

    GlowrectAction.prototype.validations = function(contexts) {
      var warnings;
      warnings = [];
      if (contexts.length > 1) {
        warnings.push('GlowRect will only use the first input.');
      }
      return {
        warnings: warnings
      };
    };

    GlowrectAction.prototype.setUniforms = function() {
      var glow, rx, ry, sx, sy, x, y;
      x = parseInt(this.getParameter('x') - 128.0);
      this.glowMaterial.uniforms['x'].value = x / 255.0;
      y = parseInt(this.getParameter('y') - 128.0);
      this.glowMaterial.uniforms['y'].value = y / 255.0;
      sx = parseInt(this.getParameter('width'));
      this.glowMaterial.uniforms['sizeX'].value = sx / 255.0;
      sy = parseInt(this.getParameter('height'));
      this.glowMaterial.uniforms['sizeY'].value = sy / 255.0;
      rx = parseInt(this.getParameter('radiusX'));
      this.glowMaterial.uniforms['radiusX'].value = rx / 255.0;
      ry = parseInt(this.getParameter('radiusY'));
      this.glowMaterial.uniforms['radiusY'].value = ry / 255.0;
      glow = parseInt(this.getParameter('glow'));
      glow = (255.0 - glow) / 30.0;
      glow *= glow;
      return this.glowMaterial.uniforms['frameSharpness'].value = glow;
    };

    GlowrectAction.prototype.render = function(inputs) {
      GlowrectAction.__super__.render.call(this);
      if (this.screenAlignedQuadMesh.material === null) {
        this.glowMaterial = new THREE.ShaderMaterial(THREE.RoundRectShader);
        this.screenAlignedQuadMesh.material = this.glowMaterial;
      }
      this.setUniforms();
      this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, this.renderTarget, true);
      return this.renderTarget;
    };

    return GlowrectAction;

  })(Webbzeug.Action);

}).call(this);
