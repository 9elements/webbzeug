(function() {
  var LightAction, _base, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (window.Webbzeug == null) {
    window.Webbzeug = {};
  }

  if ((_base = window.Webbzeug).Actions == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Light = LightAction = (function(_super) {
    __extends(LightAction, _super);

    function LightAction() {
      _ref = LightAction.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    LightAction.prototype.type = 'light';

    LightAction.prototype.name = 'Light';

    LightAction.prototype.availableParameters = function() {
      return {
        /*
        eyeX: { name: 'Eye X', type: 'float', min: -1, max: 1, default: 0.5, scrollPrecision: 0.001 },
        eyeY: { name: 'Eye Y', type: 'float', min: -1, max: 1, default: 0.5, scrollPrecision: 0.001 }
        eyeZ: { name: 'Eye Z', type: 'float', min: -1, max: 1, default: 0.5, scrollPrecision: 0.001 }
        */

        lightX: {
          name: 'Light X',
          type: 'float',
          min: -300,
          max: 300,
          "default": 100,
          scrollPrecision: 1
        },
        lightY: {
          name: 'Light Y',
          type: 'float',
          min: -300,
          max: 300,
          "default": 100,
          scrollPrecision: 1
        },
        lightZ: {
          name: 'Light Z',
          type: 'float',
          min: 0,
          max: 300,
          "default": 200,
          scrollPrecision: 1
        },
        power: {
          name: 'Power',
          type: 'integer',
          min: 1,
          max: 200,
          "default": 60,
          scrollPrecision: 1
        },
        diffuseColor: {
          name: 'Diffuse',
          type: 'color',
          "default": '#000000'
        },
        reflectionColor: {
          name: 'Reflection',
          type: 'color',
          "default": '#000000'
        }
      };
    };

    LightAction.prototype.magnitude = function(x, y, z) {
      var len;
      x *= x;
      y *= y;
      z *= z;
      len = x + y + z;
      return Math.sqrt(len);
    };

    LightAction.prototype.normalize = function(v) {
      var mag;
      mag = this.magnitude(v.x, v.y, v.z);
      return {
        x: v.x / mag,
        y: v.y / mag,
        z: v.z / mag
      };
    };

    LightAction.prototype.dot = function(v1, v2) {
      return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    };

    LightAction.prototype.validations = function(contexts) {
      var errors, warnings;
      errors = [];
      warnings = [];
      if (contexts.length < 2) {
        errors.push('Light needs exactly 2 inputs.');
      }
      if (contexts.length > 2) {
        warnings.push('Light will only use the first 2 inputs.');
      }
      return {
        errors: errors,
        warnings: warnings
      };
    };

    LightAction.prototype.setUniforms = function() {
      var colorRGB, x, y, z;
      x = parseInt(this.getParameter('power'));
      this.directLightMaterial.uniforms['specularPower'].value = x / 10;
      x = parseInt(this.getParameter('lightX') * 10);
      y = parseInt(this.getParameter('lightY') * 10);
      z = parseInt(this.getParameter('lightZ') * 10);
      this.directLightMaterial.uniforms['vLightPosition'].value = new THREE.Vector3(x, y, z);
      colorRGB = Webbzeug.Utilities.getRgb2(this.getParameter('diffuseColor'));
      this.directLightMaterial.uniforms["diffuseR"].value = colorRGB[0] / 255.0;
      this.directLightMaterial.uniforms["diffuseG"].value = colorRGB[1] / 255.0;
      this.directLightMaterial.uniforms["diffuseB"].value = colorRGB[2] / 255.0;
      colorRGB = Webbzeug.Utilities.getRgb2(this.getParameter('reflectionColor'));
      this.directLightMaterial.uniforms["specularR"].value = colorRGB[0] / 255.0;
      this.directLightMaterial.uniforms["specularG"].value = colorRGB[1] / 255.0;
      return this.directLightMaterial.uniforms["specularB"].value = colorRGB[2] / 255.0;
    };

    LightAction.prototype.render = function(inputs) {
      LightAction.__super__.render.call(this);
      if (this.screenAlignedQuadMesh.material === null) {
        this.directLightMaterial = new THREE.ShaderMaterial(THREE.DirectionalLightShader);
        this.screenAlignedQuadMesh.material = this.directLightMaterial;
      }
      this.directLightMaterial.uniforms['baseMap'].value = inputs[0];
      this.directLightMaterial.uniforms['bumpMap'].value = inputs[1];
      this.setUniforms();
      this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, this.renderTarget, true);
      return this.renderTarget;
    };

    return LightAction;

  })(Webbzeug.Action);

}).call(this);
