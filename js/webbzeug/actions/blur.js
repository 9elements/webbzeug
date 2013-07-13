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
            disc: 'Disc',
            gauss: 'Gauss'
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

    BlurAction.prototype.renderGauss = function(inputs) {
      var i, strength, _i, _results;
      this.copyInputToRenderTarget(inputs[0]);
      strength = parseInt(this.getParameter('strength'));
      _results = [];
      for (i = _i = 0; 0 <= strength ? _i < strength : _i > strength; i = 0 <= strength ? ++_i : --_i) {
        this.renderHorizontalGaussPass();
        _results.push(this.renderVerticalPass());
      }
      return _results;
    };

    BlurAction.prototype.renderHorizontalGaussPass = function(input) {
      this.createTempTarget();
      if (!(this.horizonalGaussBlurMaterial != null)) {
        this.horizonalGaussBlurMaterial = new THREE.ShaderMaterial(THREE.HorizontalGaussianShader);
      }
      this.screenAlignedQuadMesh.material = this.horizonalGaussBlurMaterial;
      this.horizonalGaussBlurMaterial.uniforms['tDiffuse'].value = this.renderTarget;
      this.horizonalGaussBlurMaterial.uniforms['h'].value = 1.0 / 256.0;
      return this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, this.tempTarget, true);
    };

    BlurAction.prototype.renderVerticalPass = function() {
      if (!(this.verticalGaussBlurMaterial != null)) {
        this.verticalGaussBlurMaterial = new THREE.ShaderMaterial(THREE.VerticalGaussianShader);
      }
      this.screenAlignedQuadMesh.material = this.verticalGaussBlurMaterial;
      this.verticalGaussBlurMaterial.uniforms['tDiffuse'].value = this.tempTarget;
      this.verticalGaussBlurMaterial.uniforms['v'].value = 1.0 / 256.0;
      return this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, this.renderTarget, true);
    };

    BlurAction.prototype.copyInputToRenderTarget = function(input) {
      if (!(this.copyMaterial != null)) {
        this.copyMaterial = new THREE.ShaderMaterial(THREE.CopyShader);
      }
      this.screenAlignedQuadMesh.material = this.copyMaterial;
      this.copyMaterial.uniforms['tDiffuse'].value = input;
      return this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, this.renderTarget, true);
    };

    BlurAction.prototype.render = function(inputs) {
      BlurAction.__super__.render.call(this);
      switch (this.getParameter('type')) {
        case 'disc':
          this.renderDisc(inputs);
          break;
        case 'gauss':
          this.renderGauss(inputs);
      }
      return this.renderTarget;
    };

    return BlurAction;

  })(Webbzeug.Action);

}).call(this);
