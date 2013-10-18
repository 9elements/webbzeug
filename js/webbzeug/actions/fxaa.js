(function() {
  var FxaaAction, _base, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (window.Webbzeug == null) {
    window.Webbzeug = {};
  }

  if ((_base = window.Webbzeug).Actions == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Fxaa = FxaaAction = (function(_super) {
    __extends(FxaaAction, _super);

    function FxaaAction() {
      _ref = FxaaAction.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FxaaAction.prototype.type = 'fxaa';

    FxaaAction.prototype.name = 'Fxaa';

    FxaaAction.prototype.validations = function(contexts) {
      var errors, warnings;
      errors = [];
      warnings = [];
      if (contexts.length > 1) {
        warnings.push('Fxaa will only use the first input.');
      }
      if (contexts.length < 1) {
        errors.push('Fxaa needs exactly 1 input.');
      }
      return {
        errors: errors,
        warnings: warnings
      };
    };

    FxaaAction.prototype.render = function(inputs) {
      FxaaAction.__super__.render.call(this);
      if (this.screenAlignedQuadMesh.material === null) {
        this.normalMaterial = new THREE.ShaderMaterial(THREE.FxaaShader);
        this.screenAlignedQuadMesh.material = this.normalMaterial;
      }
      this.normalMaterial.uniforms['input1'].value = inputs[0];
      this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, this.renderTarget, true);
      return this.renderTarget;
    };

    return FxaaAction;

  })(Webbzeug.Action);

}).call(this);
