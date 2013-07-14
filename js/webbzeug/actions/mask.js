(function() {
  var MaskAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Mask = MaskAction = (function(_super) {

    __extends(MaskAction, _super);

    function MaskAction() {
      return MaskAction.__super__.constructor.apply(this, arguments);
    }

    MaskAction.prototype.type = 'mask';

    MaskAction.prototype.name = 'Mask';

    MaskAction.prototype.availableParameters = function() {
      return {};
    };

    MaskAction.prototype.validations = function(contexts) {
      var errors, warnings;
      errors = [];
      warnings = [];
      if (contexts.length > 3) {
        warnings.push('Mask will only use the first 3 inputs.');
      }
      if (contexts.length < 3) {
        errors.push('Mask needs exactly 3 inputs.');
      }
      return {
        warnings: warnings
      };
    };

    MaskAction.prototype.render = function(inputs) {
      MaskAction.__super__.render.call(this);
      if (this.screenAlignedQuadMesh.material === null) {
        this.maskMaterial = new THREE.ShaderMaterial(THREE.MaskShader);
        this.screenAlignedQuadMesh.material = this.maskMaterial;
      }
      this.maskMaterial.uniforms['input1'].value = inputs[0];
      this.maskMaterial.uniforms['input2'].value = inputs[1];
      this.maskMaterial.uniforms['blendMap'].value = inputs[2];
      this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, this.renderTarget, true);
      return this.renderTarget;
    };

    return MaskAction;

  })(Webbzeug.Action);

}).call(this);
