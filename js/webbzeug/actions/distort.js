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

  window.Webbzeug.Actions.Distort = NormalAction = (function(_super) {
    __extends(NormalAction, _super);

    function NormalAction() {
      _ref = NormalAction.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    NormalAction.prototype.type = 'distort';

    NormalAction.prototype.name = 'Distort';

    NormalAction.prototype.availableParameters = function() {
      return {
        amount: {
          name: 'Amount',
          type: 'integer',
          min: 0,
          max: 255,
          "default": 0,
          scrollPrecision: 1
        }
      };
    };

    NormalAction.prototype.validations = function(contexts) {
      var errors, warnings;
      errors = [];
      warnings = [];
      if (contexts.length > 2) {
        warnings.push('Distort will only use the first two inputs.');
      }
      if (contexts.length < 2) {
        errors.push('Distort needs exactly 2 inputs.');
      }
      return {
        errors: errors,
        warnings: warnings
      };
    };

    NormalAction.prototype.render = function(inputs) {
      var x;
      NormalAction.__super__.render.call(this);
      if (this.screenAlignedQuadMesh.material === null) {
        this.distortMaterial = new THREE.ShaderMaterial(THREE.DistortShader);
        this.screenAlignedQuadMesh.material = this.distortMaterial;
      }
      this.distortMaterial.uniforms['baseMap'].value = inputs[0];
      this.distortMaterial.uniforms['distMap'].value = inputs[1];
      x = parseInt(this.getParameter('amount'));
      x /= 1024.0;
      this.distortMaterial.uniforms['amount'].value = x;
      this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, this.renderTarget, true);
      return this.renderTarget;
    };

    return NormalAction;

  })(Webbzeug.Action);

}).call(this);
