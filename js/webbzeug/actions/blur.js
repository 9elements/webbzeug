(function() {
  var BlurAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Blur = BlurAction = (function(_super) {

    __extends(BlurAction, _super);

    function BlurAction() {
      return BlurAction.__super__.constructor.apply(this, arguments);
    }

    BlurAction.prototype.type = 'blur';

    BlurAction.prototype.name = 'Blur';

    BlurAction.prototype.availableParameters = function() {
      return {
        strength: {
          name: 'Strength',
          type: 'integer',
          "default": 1,
          min: 1,
          max: 30,
          scrollPrecision: 1
        },
        type: {
          name: 'Type',
          type: 'enum',
          values: {
            disc: 'Disc'
          },
          "default": 'disc'
        }
      };
    };

    BlurAction.prototype.validations = function(contexts) {
      var errors, warnings;
      warnings = [];
      errors = [];
      if (contexts.length > 1) {
        warnings.push('Blur will only use the first input.');
      }
      if (contexts.length < 1) {
        errors.push('Blur needs exactly 1 input.');
      }
      return {
        errors: errors,
        warnings: warnings
      };
    };

    BlurAction.prototype.renderDisc = function(inputs) {
      var strength;
      if (!(this.discBlurMaterial != null)) {
        this.discBlurMaterial = new THREE.ShaderMaterial(THREE.DiscBlur);
      }
      this.screenAlignedQuadMesh.material = this.discBlurMaterial;
      this.discBlurMaterial.uniforms['tDiffuse'].value = inputs[0];
      strength = parseInt(this.getParameter('strength'));
      this.discBlurMaterial.uniforms['discRadius'].value = strength * 0.0007;
      return this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, this.renderTarget, true);
    };

    BlurAction.prototype.render = function(inputs) {
      BlurAction.__super__.render.call(this);
      switch (this.getParameter('type')) {
        case 'disc':
          this.renderDisc(inputs);
      }
      return this.renderTarget;
    };

    return BlurAction;

  })(Webbzeug.Action);

}).call(this);
