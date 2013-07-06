(function() {
  var LightAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Light = LightAction = (function(_super) {

    __extends(LightAction, _super);

    function LightAction() {
      return LightAction.__super__.constructor.apply(this, arguments);
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
          min: -1,
          max: 1,
          "default": 0.5,
          scrollPrecision: 0.001
        },
        lightY: {
          name: 'Light Y',
          type: 'float',
          min: -1,
          max: 1,
          "default": 0.5,
          scrollPrecision: 0.001
        },
        lightZ: {
          name: 'Light Z',
          type: 'float',
          min: -1,
          max: 1,
          "default": 0.5,
          scrollPrecision: 0.001
        },
        power: {
          name: 'Power',
          type: 'integer',
          min: 0.1,
          max: 100,
          "default": 20,
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
      /*
          x = parseInt @getParameter('contrast')
          x /= 255.0
          x *= 2.0
          @directLightMaterial.uniforms['contrast'].value = x
      
          x = parseInt @getParameter('brightness')
          x /= 255.0
          x *= 2.0
          @directLightMaterial.uniforms['brightness'].value = x
      
          x = parseInt @getParameter('saturation')
          x /= 255.0
          x *= 2.0
          @directLightMaterial.uniforms['saturation'].value = x
      */

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
