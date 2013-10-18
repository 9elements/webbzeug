(function() {
  var InvertAction, _base, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (window.Webbzeug == null) {
    window.Webbzeug = {};
  }

  if ((_base = window.Webbzeug).Actions == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Invert = InvertAction = (function(_super) {
    __extends(InvertAction, _super);

    function InvertAction() {
      _ref = InvertAction.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    InvertAction.prototype.type = 'invert';

    InvertAction.prototype.name = 'Invert';

    InvertAction.prototype.validations = function(contexts) {
      var errors, warnings;
      warnings = [];
      errors = [];
      if (contexts.length > 1) {
        warnings.push('Invert will only use the first input.');
      }
      if (contexts.length < 1) {
        errors.push('Invert needs exactly one input.');
      }
      return {
        errors: errors,
        warnings: warnings
      };
    };

    InvertAction.prototype.render = function(inputs) {
      InvertAction.__super__.render.call(this);
      if (this.screenAlignedQuadMesh.material === null) {
        this.ninvertMaterial = new THREE.ShaderMaterial(THREE.InvertShader);
        this.screenAlignedQuadMesh.material = this.ninvertMaterial;
      }
      this.ninvertMaterial.uniforms['input1'].value = inputs[0];
      this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, this.renderTarget, true);
      return this.renderTarget;
    };

    return InvertAction;

  })(Webbzeug.Action);

}).call(this);
