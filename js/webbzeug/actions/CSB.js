(function() {
  var NormalAction, _base, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (window.Webbzeug == null) {
    window.Webbzeug = {};
  }

  if ((_base = window.Webbzeug).Actions == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.CSB = NormalAction = (function(_super) {
    __extends(NormalAction, _super);

    function NormalAction() {
      _ref = NormalAction.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    NormalAction.prototype.type = 'csb';

    NormalAction.prototype.name = 'CSB';

    NormalAction.prototype.availableParameters = function() {
      return {
        contrast: {
          name: 'Contrast',
          type: 'integer',
          min: 0,
          max: 255,
          "default": 127,
          scrollPrecision: 1
        },
        brightness: {
          name: 'Brightness',
          type: 'integer',
          min: 0,
          max: 255,
          "default": 127,
          scrollPrecision: 1
        },
        saturation: {
          name: 'Saturation',
          type: 'integer',
          min: 0,
          max: 255,
          "default": 127,
          scrollPrecision: 1
        }
      };
    };

    NormalAction.prototype.validations = function(contexts) {
      var errors, warnings;
      errors = [];
      warnings = [];
      if (contexts.length > 1) {
        warnings.push('CSB will only use one input.');
      }
      if (contexts.length < 1) {
        errors.push('CSB needs one input.');
      }
      return {
        errors: errors,
        warnings: warnings
      };
    };

    NormalAction.prototype.setUniforms = function() {
      var x;
      x = parseInt(this.getParameter('contrast'));
      x /= 255.0;
      x *= 2.0;
      this.distortMaterial.uniforms['contrast'].value = x;
      x = parseInt(this.getParameter('brightness'));
      x /= 255.0;
      x *= 2.0;
      this.distortMaterial.uniforms['brightness'].value = x;
      x = parseInt(this.getParameter('saturation'));
      x /= 255.0;
      x *= 2.0;
      return this.distortMaterial.uniforms['saturation'].value = x;
    };

    NormalAction.prototype.render = function(inputs) {
      NormalAction.__super__.render.call(this);
      if (this.screenAlignedQuadMesh.material === null) {
        this.distortMaterial = new THREE.ShaderMaterial(THREE.CSBShader);
        this.screenAlignedQuadMesh.material = this.distortMaterial;
      }
      this.distortMaterial.uniforms['input1'].value = inputs[0];
      this.setUniforms();
      this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, this.renderTarget, true);
      return this.renderTarget;
    };

    return NormalAction;

  })(Webbzeug.Action);

}).call(this);
