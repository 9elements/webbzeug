(function() {
  var NormalAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Blend = NormalAction = (function(_super) {

    __extends(NormalAction, _super);

    function NormalAction() {
      return NormalAction.__super__.constructor.apply(this, arguments);
    }

    NormalAction.prototype.type = 'blend';

    NormalAction.prototype.name = 'Blend';

    NormalAction.prototype.validations = function(contexts) {
      var errors, warnings;
      errors = [];
      warnings = [];
      if (contexts.length > 3) {
        warnings.push('Blend will only use the first three inputs.');
      }
      if (contexts.length < 3) {
        errors.push('Blend needs exactly 3 inputs.');
      }
      return {
        errors: errors,
        warnings: warnings
      };
    };

    NormalAction.prototype.render = function(inputs) {
      NormalAction.__super__.render.call(this);
      if (this.screenAlignedQuadMesh.material === null) {
        this.blendMaterial = new THREE.ShaderMaterial(THREE.BlendShader);
        this.screenAlignedQuadMesh.material = this.blendMaterial;
      }
      this.blendMaterial.uniforms['input1'].value = inputs[0];
      this.blendMaterial.uniforms['input2'].value = inputs[1];
      this.blendMaterial.uniforms['blendMap'].value = inputs[2];
      this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, this.renderTarget, true);
      return this.renderTarget;
    };

    return NormalAction;

  })(Webbzeug.Action);

}).call(this);
