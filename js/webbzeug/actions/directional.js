(function() {
  var DirectionalAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Directional = DirectionalAction = (function(_super) {

    __extends(DirectionalAction, _super);

    function DirectionalAction() {
      return DirectionalAction.__super__.constructor.apply(this, arguments);
    }

    DirectionalAction.prototype.type = 'directional';

    DirectionalAction.prototype.name = 'Directional';

    DirectionalAction.prototype.availableParameters = function() {
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
            gauss: 'Gauss',
            triangle: 'Triangle'
          },
          "default": 'gauss'
        },
        direction: {
          name: "Direction",
          type: 'enum',
          values: {
            vertical: 'Vertical',
            horizontal: 'Horizontal'
          },
          "default": 'horizontal'
        }
      };
    };

    DirectionalAction.prototype.validations = function(contexts) {
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

    DirectionalAction.prototype.renderTriangle = function(inputs) {
      var strength;
      strength = parseInt(this.getParameter('strength'));
      if (this.getParameter('direction') === 'vertical') {
        return this.renderVerticalTrianglePass(inputs[0]);
      } else {
        return this.renderHorizontalTrianglePass(inputs[0]);
      }
    };

    DirectionalAction.prototype.renderHorizontalTrianglePass = function(input) {
      var strength;
      strength = parseInt(this.getParameter('strength'));
      if (!(this.horizonalTriangleBlurMaterial != null)) {
        this.horizonalTriangleBlurMaterial = new THREE.ShaderMaterial(THREE.TriangleBlurH);
      }
      this.screenAlignedQuadMesh.material = this.horizonalTriangleBlurMaterial;
      this.horizonalTriangleBlurMaterial.uniforms['tDiffuse'].value = input;
      this.horizonalTriangleBlurMaterial.uniforms['delta'].value = new THREE.Vector2(strength / 256.0, 0);
      return this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, this.renderTarget, true);
    };

    DirectionalAction.prototype.renderVerticalTrianglePass = function(input) {
      var strength;
      strength = parseInt(this.getParameter('strength'));
      if (!(this.verticalTriangleBlurMaterial != null)) {
        this.verticalTriangleBlurMaterial = new THREE.ShaderMaterial(THREE.TriangleBlurV);
      }
      this.screenAlignedQuadMesh.material = this.verticalTriangleBlurMaterial;
      this.verticalTriangleBlurMaterial.uniforms['tDiffuse'].value = input;
      this.verticalTriangleBlurMaterial.uniforms['delta'].value = new THREE.Vector2(0, strength / 256.0);
      return this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, this.renderTarget, true);
    };

    DirectionalAction.prototype.renderGauss = function(inputs) {
      var destination, i, renderToTarget, source, strength, _i;
      this.copyInputToRenderTarget(inputs[0]);
      strength = parseInt(this.getParameter('strength'));
      renderToTarget = false;
      this.createTempTarget();
      for (i = _i = 0; 0 <= strength ? _i < strength : _i > strength; i = 0 <= strength ? ++_i : --_i) {
        source = this.renderTarget;
        destination = this.tempTarget;
        if (renderToTarget) {
          source = this.tempTarget;
          destination = this.renderTarget;
        }
        if (this.getParameter('direction') === 'vertical') {
          this.renderVerticalGaussPass(source, destination, renderToTarget);
        } else {
          this.renderHorizontalGaussPass(source, destination, renderToTarget);
        }
        renderToTarget = !renderToTarget;
      }
      if (renderToTarget) {
        return this.copyInputToRenderTarget(this.tempTarget);
      }
    };

    DirectionalAction.prototype.renderHorizontalGaussPass = function(source, destination, renderToTarget) {
      if (!(this.horizonalGaussBlurMaterial != null)) {
        this.horizonalGaussBlurMaterial = new THREE.ShaderMaterial(THREE.HorizontalGaussianShader);
      }
      this.screenAlignedQuadMesh.material = this.horizonalGaussBlurMaterial;
      this.horizonalGaussBlurMaterial.uniforms['tDiffuse'].value = source;
      this.horizonalGaussBlurMaterial.uniforms['h'].value = 1.0 / 256.0;
      return this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, destination, true);
    };

    DirectionalAction.prototype.renderVerticalGaussPass = function(source, destination, renderToTarget) {
      if (!(this.verticalGaussBlurMaterial != null)) {
        this.verticalGaussBlurMaterial = new THREE.ShaderMaterial(THREE.VerticalGaussianShader);
      }
      this.screenAlignedQuadMesh.material = this.verticalGaussBlurMaterial;
      this.verticalGaussBlurMaterial.uniforms['tDiffuse'].value = source;
      this.verticalGaussBlurMaterial.uniforms['v'].value = 1.0 / 256.0;
      return this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, destination, true);
    };

    DirectionalAction.prototype.copyInputToRenderTarget = function(input) {
      if (!(this.copyMaterial != null)) {
        this.copyMaterial = new THREE.ShaderMaterial(THREE.CopyShader);
      }
      this.screenAlignedQuadMesh.material = this.copyMaterial;
      this.copyMaterial.uniforms['tDiffuse'].value = input;
      return this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, this.renderTarget, true);
    };

    DirectionalAction.prototype.render = function(inputs) {
      DirectionalAction.__super__.render.call(this);
      switch (this.getParameter('type')) {
        case 'gauss':
          this.renderGauss(inputs);
          break;
        case 'triangle':
          this.renderTriangle(inputs);
      }
      return this.renderTarget;
    };

    return DirectionalAction;

  })(Webbzeug.Action);

}).call(this);
