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

  window.Webbzeug.Actions.Normal = NormalAction = (function(_super) {

    __extends(NormalAction, _super);

    function NormalAction() {
      return NormalAction.__super__.constructor.apply(this, arguments);
    }

    NormalAction.prototype.type = 'normal';

    NormalAction.prototype.name = 'Normal';

    NormalAction.prototype.validations = function(contexts) {
      var errors, warnings;
      errors = [];
      warnings = [];
      if (contexts.length > 1) {
        warnings.push('Normal will only use the first input.');
      }
      if (contexts.length < 1) {
        errors.push('Normal needs exactly 1 input.');
      }
      return {
        errors: errors,
        warnings: warnings
      };
    };

    NormalAction.prototype.render = function(inputs) {
      NormalAction.__super__.render.call(this);
      if (this.screenAlignedQuadMesh.material === null) {
        this.normalMaterial = new THREE.ShaderMaterial(THREE.NormalShader);
        this.screenAlignedQuadMesh.material = this.normalMaterial;
      }
      this.normalMaterial.uniforms['input1'].value = inputs[0];
      this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, this.renderTarget, true);
      return this.renderTarget;
    };

    return NormalAction;

  })(Webbzeug.Action);

}).call(this);
