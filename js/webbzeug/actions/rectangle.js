(function() {
  var RectangleAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Rectangle = RectangleAction = (function(_super) {

    __extends(RectangleAction, _super);

    function RectangleAction() {
      return RectangleAction.__super__.constructor.apply(this, arguments);
    }

    RectangleAction.prototype.type = 'rectangle';

    RectangleAction.prototype.name = 'Rect';

    RectangleAction.prototype.availableParameters = function() {
      return {
        x: {
          name: 'X',
          type: 'integer',
          min: 0,
          max: 255,
          "default": 64,
          scrollPrecision: 1
        },
        y: {
          name: 'Y',
          type: 'integer',
          min: 0,
          max: 255,
          "default": 64,
          scrollPrecision: 1
        },
        width: {
          name: 'Width',
          type: 'integer',
          min: 1,
          max: 255,
          "default": 128,
          scrollPrecision: 1
        },
        height: {
          name: 'Height',
          type: 'integer',
          min: 1,
          max: 255,
          "default": 128,
          scrollPrecision: 1
        },
        color: {
          name: 'Color',
          type: 'color',
          "default": 'rgba(255,255,255,1)'
        }
      };
    };

    RectangleAction.prototype.validations = function(contexts) {
      var warnings;
      warnings = [];
      if (contexts.length > 1) {
        warnings.push('Rectangle will only use the first input.');
      }
      return {
        warnings: warnings
      };
    };

    RectangleAction.prototype.setUniforms = function() {
      var colorRGB, sx, sy, x, y;
      x = parseInt(this.getParameter('x'));
      this.glowMaterial.uniforms['x'].value = x / 255.0;
      y = parseInt(this.getParameter('y'));
      this.glowMaterial.uniforms['y'].value = y / 255.0;
      sx = parseInt(this.getParameter('width'));
      this.glowMaterial.uniforms['width'].value = sx / 255.0;
      sy = parseInt(this.getParameter('height'));
      this.glowMaterial.uniforms['height'].value = sy / 255.0;
      colorRGB = Webbzeug.Utilities.getRgb2(this.getParameter('color'));
      this.glowMaterial.uniforms["r"].value = colorRGB[0] / 255.0;
      this.glowMaterial.uniforms["g"].value = colorRGB[1] / 255.0;
      return this.glowMaterial.uniforms["b"].value = colorRGB[2] / 255.0;
    };

    RectangleAction.prototype.render = function(inputs) {
      RectangleAction.__super__.render.call(this);
      if (this.screenAlignedQuadMesh.material === null) {
        this.glowMaterial = new THREE.ShaderMaterial(THREE.RectangleShader);
        this.screenAlignedQuadMesh.material = this.glowMaterial;
      }
      this.setUniforms();
      this.glowMaterial.uniforms['input1'].value = inputs[0];
      this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, this.renderTarget, true);
      return this.renderTarget;
    };

    return RectangleAction;

  })(Webbzeug.Action);

}).call(this);
